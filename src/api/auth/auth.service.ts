import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ExecuterEntity } from "src/core/entity";
import { ExecuterRepository, UserRepository } from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import {
	AuthorizationError,
	IncorrectOTP,
	InvalidToken,
	NotSentMessage,
	OtpExpired,
	PasswordNotMatch,
	TooManyOtpAttempts,
	UserAlreadyExists,
	UsernameOrPasswordIncorrect,
	UserNotFound,
} from "./exception";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";
import { MailService } from "../mail/mail.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { config } from "../../config";
import * as otpGenerator from "otp-generator";
import { ActivateUserDto } from "./dto/activate-user.dto";
import { DataSource, QueryRunner } from "typeorm";
import { SendSMSCodeDto } from "./dto/send-sms-code.dto";
import { SmsService } from "../service/sms-service/sms-service";
import { SendMsgFromBot } from "telegram-bot-sender";
import { VerifySMSCodeDto } from "./dto/verify-sms-code.dto";

@Injectable()
export class AuthService extends BaseService<CreateAuthDto, UpdateAuthDto, ExecuterEntity> {
	constructor(
		@InjectRepository(ExecuterEntity) private readonly userRepo: ExecuterRepository,
		private readonly jwtService: JwtService,
		private readonly jwtToken: JwtToken,
		private readonly mailService: MailService,
		private readonly dataSource: DataSource,
		private readonly smsService: SmsService,
	) {
		super(userRepo, "User");
	}

	public async validateUserGoogle(
		google_id: string,
		email: string,
		firstName: string,
		lastName: string,
		password: string,
		lang: string,
	): Promise<IResponse<unknown>> {
		let user = await this.getRepository.findOne({ where: { email: email } });
		let refresh_token, access_token, message, data;
		if (!user) {
			user = this.getRepository.create({
				google_id,
				email,
				first_name: firstName,
				last_name: lastName,
				password: password,
			});
			refresh_token = await this.jwtToken.generateToken(
				user,
				config.REFRESH_EXPIRE_TIME,
				config.REFRESH_SECRET_KEY,
			);
			access_token = await this.jwtToken.generateToken(
				user,
				config.ACCESS_EXPIRE_TIME,
				config.ACCESS_SECRET_KEY,
			);
			const hashed_token = await BcryptEncryption.encrypt(refresh_token);
			user.hashed_token = hashed_token;
			await this.getRepository.save(user);
			data = { ...user, access_token, refresh_token };
			message = responseByLang("create", lang);
		} else {
			refresh_token = await this.jwtToken.generateToken(
				user,
				config.REFRESH_EXPIRE_TIME,
				config.REFRESH_SECRET_KEY,
			);
			access_token = await this.jwtToken.generateToken(
				user,
				config.ACCESS_EXPIRE_TIME,
				config.ACCESS_SECRET_KEY,
			);
			const hashed_token = await BcryptEncryption.encrypt(refresh_token);
			user.hashed_token = hashed_token;
			user.google_id = google_id;
			await this.getRepository.save(user);
			data = { access_token, refresh_token };
			message = responseByLang("login", lang);
		}

		return { status_code: 201, data, message };
	}

	public async refreshToken(token: string, lang: string) {
		let data;
		try {
			data = await this.jwtToken.verifyRefresh(token);
		} catch (err) {
			throw new AuthorizationError();
		}
		const { data: user } = await this.findOneById(data.id, "en");

		// const check = await BcryptEncryption.compare(token, user.hashed_token);
		// if (!check) {
		// 	throw new InvalidToken();
		// }
		const access_token = await this.jwtToken.generateToken(
			user,
			config.ACCESS_EXPIRE_TIME,
			config.ACCESS_SECRET_KEY,
		);
		const refresh_token = await this.jwtToken.generateToken(
			user,
			config.REFRESH_EXPIRE_TIME,
			config.REFRESH_SECRET_KEY,
		);
		const hashed_token = await BcryptEncryption.encrypt(refresh_token);
		await this.getRepository.update(user.id, { hashed_token });

		return { status_code: 200, data: { access_token, refresh_token }, message: "success" };
	}

	public async register(createAuthDto: CreateAuthDto, lang: string): Promise<IResponse<unknown>> {
		console.log("register started:", new Date());

		const current_date = new Date();
		const ten_minutes_ago = new Date(current_date.getTime() - 10 * 60000);
		const otp = generateOtp();
		const otp_expiration = new Date(current_date.getTime() + 3 * 60000);

		// Fetch only necessary fields
		let user = await this.userRepo.findOne({
			where: { email: createAuthDto.email, is_deleted: false },
			select: {
				id: true,
				email: true,
				otp: true,
				otp_expiration: true,
				is_active: true,
				otp_request_count: true,
				otp_blocked_until: true,
				otp_blocked_duration: true,
			},
		});
		console.log(user);

		if (user) {
			if (user.is_active) {
				throw new UserAlreadyExists();
			}
			if (user.otp_blocked_until && current_date < user.otp_blocked_until) {
				throw new TooManyOtpAttempts();
			}
			if (user.otp_expiration < ten_minutes_ago) {
				user.otp_request_count = 0;
			}

			user.otp_request_count = (user.otp_request_count || 0) + 1;

			if (user.otp_request_count > 10) {
				const block_duration = (user.otp_blocked_duration || 3) * 2;
				user.otp_blocked_until = new Date(
					current_date.getTime() + block_duration * 3600000,
				);
				user.otp_blocked_duration = block_duration;

				// Bu save qismini olib tashlamang yo'qsa code noto'g'ri ishlashi mumkin
				await this.userRepo.save(user);
				throw new TooManyOtpAttempts();
			}

			user.otp = otp;
			user.otp_expiration = otp_expiration;
		} else {
			const hashed_password = await BcryptEncryption.encrypt(createAuthDto.password);
			user = this.userRepo.create({
				...createAuthDto,
				password: hashed_password,
				is_active: false,
				otp,
				otp_expiration,
				otp_request_count: 1,
			});
		}

		// Save the user and send the OTP concurrently
		await Promise.all([
			this.userRepo.save(user),
			this.mailService.sendOTP(createAuthDto.email, otp),
		]);
		console.log("OTP: ", otp);
		console.log("register finished:", new Date());
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			data: { id: user.id, email: user.email },
			message,
		};
	}

	public async activate(dto: ActivateUserDto, lang: string): Promise<IResponse<unknown>> {
		const user = await this.findOneById(dto.user_id, lang, {
			where: { is_deleted: false, is_active: false },
		});
		if (!user || user.data.otp !== dto.otp) {
			throw new IncorrectOTP();
		}
		if (user.data.otp_expiration < new Date()) {
			throw new OtpExpired();
		}
		user.data.is_active = true;
		user.data.otp = "";
		user.data.otp_request_count = 0;
		user.data.otp_blocked_duration = 0;
		user.data.otp_blocked_until = null as unknown as Date;
		user.data.otp_expiration = null as unknown as Date;

		const access_token = await this.jwtToken.generateToken(
			user.data,
			config.ACCESS_EXPIRE_TIME,
			config.ACCESS_SECRET_KEY,
		);
		const refresh_token = await this.jwtToken.generateToken(
			user.data,
			config.REFRESH_EXPIRE_TIME,
			config.REFRESH_SECRET_KEY,
		);
		const hashed_token = await BcryptEncryption.encrypt(refresh_token);
		user.data.hashed_token = hashed_token;
		await this.userRepo.save(user.data);

		const message = responseByLang("create", lang);
		return { status_code: 201, data: { ...user.data, access_token, refresh_token }, message };
	}

	public async login(loginDto: LoginDto, lang: string): Promise<IResponse<ExecuterEntity | any>> {
		const user = await this.getRepository.findOne({
			where: { email: loginDto.email, is_deleted: false },
		});
		if (!user) {
			throw new UsernameOrPasswordIncorrect();
		}
		if (!user || !(await BcryptEncryption.compare(loginDto.password, user.password))) {
			throw new UsernameOrPasswordIncorrect();
		}
		const access_token = await this.jwtToken.generateToken(
			user,
			config.ACCESS_EXPIRE_TIME,
			config.ACCESS_SECRET_KEY,
		);
		const refresh_token = await this.jwtToken.generateToken(
			user,
			config.REFRESH_EXPIRE_TIME,
			config.REFRESH_SECRET_KEY,
		);

		const hashed_token = await BcryptEncryption.encrypt(refresh_token);
		user.hashed_token = hashed_token; // Save the hashed token
		await this.getRepository.save(user);
		const message = responseByLang("success", lang);
		return { status_code: 200, data: { access_token, refresh_token }, message };
	}

	public async logout(user: ExecuterEntity, lang: string): Promise<IResponse<unknown>> {
		user.hashed_token = ""; // Hashed tokenni null ga o'rnatish
		await this.userRepo.save(user);
		const message = responseByLang("logout", lang);
		return {
			status_code: 200,
			data: {},
			message,
		};
	}

	public async loginWithLink(search_email: string, lang: string): Promise<IResponse<unknown>> {
		try {
			const user = await this.getRepository.findOne({
				where: { email: search_email, is_deleted: false },
			});
			if (!user) {
				throw new UserNotFound();
			}
			const reset_token = await this.jwtToken.generateToken(
				user,
				config.RESET_TOKEN_EXPIRE_TIME,
				config.ACCESS_SECRET_KEY,
			);
			if (user) {
				try {
					await this.mailService.sendMailLink(user, reset_token);
				} catch (error) {
					throw new NotSentMessage();
				}
			}
			const message = responseByLang("link_sent", lang);
			return { status_code: 200, data: {}, message };
		} catch (error) {
			throw error;
		}
	}

	public async sendSMSCode(dto: SendSMSCodeDto, lang: string): Promise<IResponse<unknown>> {
		console.log(`sendSMSCode ga kirish`);

		const currentDate = new Date();
		const tenMinutesAgo = new Date(currentDate.getTime() - 10 * 60000);
		const otp = generateOtp(); // Tasdiqlash kodi yaratish
		const otpExpiration = new Date(currentDate.getTime() + 3 * 60000); // 3 daqiqadan keyin muddati tugaydi

		// Foydalanuvchini telefon raqam bo'yicha topish
		const user = await this.userRepo.findOne({
			where: { phone_number: dto.phone_number, is_deleted: false },
			select: {
				id: true,
				phone_number: true,
				otp: true,
				otp_expiration: true,
				is_active: true,
				otp_request_count: true,
				otp_blocked_until: true,
				otp_blocked_duration: true,
			},
		});

		if (!user) {
			throw new UserNotFound(); // Agar foydalanuvchi topilmasa
		}

		// Agar foydalanuvchi bloklangan bo'lsa
		if (user.otp_blocked_until && currentDate < user.otp_blocked_until) {
			throw new TooManyOtpAttempts();
		}

		// Agar eski OTP muddati tugagan bo'lsa, so'rovlar sonini yangilash
		if (user.otp_expiration < tenMinutesAgo) {
			user.otp_request_count = 0;
		}

		// OTP so'rovlari sonini oshirish
		user.otp_request_count = (user.otp_request_count || 0) + 1;

		// Agar foydalanuvchi 10 martadan ortiq so'rov qilgan bo'lsa, bloklash
		if (user.otp_request_count > 10) {
			const blockDuration = (user.otp_blocked_duration || 3) * 2;
			user.otp_blocked_until = new Date(currentDate.getTime() + blockDuration * 3600000); // Blok vaqti
			user.otp_blocked_duration = blockDuration;

			await this.userRepo.save(user);
			throw new TooManyOtpAttempts();
		}

		// Yangi OTP yaratish va muddati o'rnatish
		user.otp = otp;
		user.otp_expiration = otpExpiration;
		const sms_message = `Kodni hech kimga bermang! Tasdiqlash kodi: ${otp}`;
		if (config.NODE_ENV == "dev") {
			SendMsgFromBot(
				config.BOT_TOKEN,
				config.OTP_CHAT_ID,
				[{ key: "Yangi otp SMS:", value: sms_message }],
				// "title",
			);
		} else {
			await Promise.all([
				this.userRepo.save(user),
				this.smsService.sendSMS({
					phone_number: dto.phone_number,
					message: `Tasdiqlash kodi: ${otp}`,
				}),
			]);
		}
		// Foydalanuvchini saqlash va SMS yuborish
		// await Promise.all([
		// 	this.userRepo.save(user),
		// 	this.smsService.sendSMS({
		// 		phone_number: dto.phone_number,
		// 		message: `Tasdiqlash kodi: ${otp}`,
		// 	}),
		// ]);

		console.log("OTP: ", otp);
		const message = responseByLang("sms_sent_successfully", lang);
		return {
			status_code: 200,
			data: { phone_number: user.phone_number, otp: user.otp },
			message,
		};
	}

	public async verifySMSCode(dto: VerifySMSCodeDto, lang: string): Promise<IResponse<unknown>> {
		console.log(`verifySMSCode ga kirish`);

		const currentDate = new Date();

		// Foydalanuvchini telefon raqam bo'yicha topish
		const { data: user } = await this.findOneBy(lang, {
			where: { phone_number: dto.phone_number, is_deleted: false },
			select: {
				id: true,
				phone_number: true,
				otp: true,
				otp_expiration: true,
				is_active: true,
			},
		});

		if (!user) {
			throw new UserNotFound(); // Agar foydalanuvchi topilmasa
		}

		// Foydalanuvchi aktiv emasligini tekshirish
		// if (!user.is_active) {
		// 	throw new UserNotActive();
		// }

		// OTP muddati tugaganligini tekshirish
		if (currentDate > user.otp_expiration) {
			throw new OtpExpired(); // Agar OTP muddati tugagan bo'lsa
		}

		// Yuborilgan OTP foydalanuvchining saqlangan OTP bilan bir xilmi yoki yo'q
		if (user.otp !== dto.otp) {
			throw new IncorrectOTP(); // Agar OTP noto'g'ri bo'lsa
		}

		// Agar hamma narsa to'g'ri bo'lsa, OTPni o'chirib tashlash (foydalanuvchi tasdiqlanganligi uchun)
		user.otp = "";
		user.otp_expiration = null as unknown as Date;
		await this.userRepo.save(user);

		console.log(`Foydalanuvchi ${user.phone_number} muvaffaqiyatli tekshirildi`);
		const message = responseByLang("code_verified", lang);
		return {
			status_code: 200,
			data: {},
			message,
		};
	}
}

function AddMinutesToDate(date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * 60000).getTime();
}
export function generateOtp(): string {
	return otpGenerator.generate(6, {
		digits: true,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
}
