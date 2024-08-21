import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/core/entity";
import { UserRepository } from "src/core/repository";
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
import { log } from "console";
import * as otpGenerator from "otp-generator";
import { ActivateUserDto } from "./dto/activate-user.dto";

@Injectable()
export class AuthService extends BaseService<CreateAuthDto, UpdateAuthDto, UserEntity> {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepo: UserRepository,
		private readonly jwtService: JwtService,
		private readonly jwtToken: JwtToken,
		private readonly mailService: MailService,
	) {
		super(userRepo, "User");
	}

	// public async validateUserGoogle(
	// 	google_id: string,
	// 	email: string,
	// 	firstName: string,
	// 	lastName: string,
	// 	password: string,
	// 	accessToken: string,
	// 	lang: string,
	// ): Promise<IResponse<unknown>> {
	// 	let user = await this.getRepository.findOne({ where: { email: email } });
	// 	let refresh_token, access_token, message, data;
	// 	if (!user) {
	// 		user = this.getRepository.create({
	// 			google_id,
	// 			email,
	// 			first_name: firstName,
	// 			last_name: lastName,
	// 			password: password,
	// 			google_access_token: accessToken,
	// 		});
	// 		refresh_token = await this.jwtToken.generateToken(
	// 			user,
	// 			config.REFRESH_EXPIRE_TIME,
	// 			config.REFRESH_SECRET_KEY,
	// 		);
	// 		access_token = await this.jwtToken.generateToken(
	// 			user,
	// 			config.ACCESS_EXPIRE_TIME,
	// 			config.ACCESS_SECRET_KEY,
	// 		);
	// 		const hashed_token = await BcryptEncryption.encrypt(refresh_token);
	// 		user.hashed_token = hashed_token;
	// 		await this.getRepository.save(user);
	// 		data = { ...user, access_token, refresh_token };
	// 		message = responseByLang("create", lang);
	// 	} else {
	// 		refresh_token = await this.jwtToken.generateToken(
	// 			user,
	// 			config.REFRESH_EXPIRE_TIME,
	// 			config.REFRESH_SECRET_KEY,
	// 		);
	// 		access_token = await this.jwtToken.generateToken(
	// 			user,
	// 			config.ACCESS_EXPIRE_TIME,
	// 			config.ACCESS_SECRET_KEY,
	// 		);
	// 		const hashed_token = await BcryptEncryption.encrypt(refresh_token);
	// 		user.hashed_token = hashed_token;
	// 		user.google_access_token = accessToken;
	// 		user.google_id = google_id;
	// 		await this.getRepository.save(user);
	// 		data = { accessToken, refresh_token };
	// 		message = responseByLang("login", lang);
	// 	}

	// 	return { status_code: 201, data, message };
	// }

	public async refreshToken(token: string, lang: string) {
		let data;
		try {
			data = await this.jwtToken.verifyRefresh(token);
		} catch (err) {
			throw new AuthorizationError();
		}
		const { data: user } = await this.findOneById(data.id, "en");

		const check = await BcryptEncryption.compare(token, user.hashed_token);
		if (!check) {
			throw new InvalidToken();
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
		await this.getRepository.update(user.id, { hashed_token });

		return { status_code: 200, data: { access_token, refresh_token }, message: "success" };
	}

	// public async register(createAuthDto: CreateAuthDto, lang: string): Promise<IResponse<unknown>> {
	// 	console.log("register started:", new Date());

	// 	// Fetch only necessary fields
	// 	const found_user = await this.userRepo.findOne({
	// 		where: { email: createAuthDto.email, is_deleted: false },
	// 		select: {
	// 			id: true,
	// 			email: true,
	// 			otp: true,
	// 			otp_expiration: true,
	// 			is_active: true,
	// 		},
	// 	});
	// 	console.log(found_user);

	// 	let user;
	// 	const otp = generateOtp();
	// 	const otp_expiration = new Date();
	// 	otp_expiration.setMinutes(otp_expiration.getMinutes() + 3);

	// 	if (found_user) {
	// 		if (found_user.is_active) {
	// 			throw new UserAlreadyExists();
	// 		}
	// 		// Update OTP and expiration in a single save call
	// 		found_user.otp = otp;
	// 		found_user.otp_expiration = otp_expiration;
	// 		user = found_user;
	// 	} else {
	// 		const hashed_password = await BcryptEncryption.encrypt(createAuthDto.password);
	// 		user = this.userRepo.create({
	// 			...createAuthDto,
	// 			password: hashed_password,
	// 			is_active: false,
	// 			otp,
	// 			otp_expiration,
	// 		});
	// 	}

	// 	// Save the user and send the OTP concurrently
	// 	await Promise.all([
	// 		this.userRepo.save(user),
	// 		this.mailService.sendOTP(createAuthDto.email, otp),
	// 	]);

	// 	console.log("register finished:", new Date());
	// 	const message = responseByLang("create", lang);
	// 	return {
	// 		status_code: 201,
	// 		data: { id: user.id, email: user.email },
	// 		message,
	// 	};
	// }
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

	public async login(loginDto: LoginDto, lang: string): Promise<IResponse<UserEntity | any>> {
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

	public async logout(user: UserEntity, lang: string): Promise<IResponse<unknown>> {
		user.hashed_token = ""; // Hashed tokenni null ga o'rnatish
		await this.userRepo.save(user);
		const message = responseByLang("logout", lang); 
		return {
			status_code: 200,
			data: {},
			message,
		};
	}

	public async forgetPassword(search_email: string, lang: string): Promise<IResponse<unknown>> {
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

	public async resetPassword(
		resetPasswordDto: ResetPasswordDto,
		user: UserEntity,
		lang: string,
	): Promise<IResponse<unknown>> {
		const { new_password, confirm_password } = resetPasswordDto;
		if (new_password !== confirm_password) {
			throw new PasswordNotMatch();
		}
		const check_user = await this.getRepository.findOne({
			where: { email: user.email, is_deleted: false },
		});
		if (!check_user || check_user.id !== user.id) {
			throw new InvalidToken();
		}
		const hashed_password = await BcryptEncryption.encrypt(new_password);
		await this.getRepository.update(check_user.id, {
			password: hashed_password,
		});
		const message = responseByLang("reset_new_password", lang);

		return { status_code: 200, data: {}, message };
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
