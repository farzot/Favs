import { Injectable } from "@nestjs/common";
import { BaseService } from "src/infrastructure/lib/baseService";
import { ExecuterEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ExecuterRepository, UserRepository } from "src/core/repository";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { NotVerifiedUser } from "./exception/not-verified-user";
import { IResponse } from "src/common/type";
import { ChangePasswordDto } from "./dto/change-password.dto";
import {
	NotSentMessage,
	PasswordNotMatch,
	UsernameOrPasswordIncorrect,
	UserNotFound,
} from "../auth/exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { MailService } from "../mail/mail.service";

@Injectable()
export class UserService extends BaseService<CreateUserDto, UpdateUserDto, ExecuterEntity> {
	constructor(
		@InjectRepository(ExecuterEntity) private readonly userRepo: ExecuterRepository,
		private readonly jwtToken: JwtToken,
		private readonly mailService: MailService,
	) {
		super(userRepo, "user");
	}

	/** update user self informations */
	public async updateUserSelfInfo(
		dto: UpdateUserDto,
		lang: string,
		user: ExecuterEntity,
	): Promise<IResponse<[]>> {
		// Agar username yangilanayotgan bo'lsa, uning unique ekanligini tekshirish
		if (dto.username && dto.username !== user.username) {
			const existingUser = await this.userRepo.findOne({ where: { username: dto.username } });
			if (existingUser) {
				const message = responseByLang("username_already_exists", lang);
				return { status_code: 400, data: [], message }; // Username allaqachon mavjud bo'lsa, xatolik qaytaramiz
			}
			user.username = dto.username; // Unique bo'lsa, yangilaymiz
		}

		// Profil ma'lumotlarini yangilash
		user.first_name = dto.first_name || user.first_name;
		user.last_name = dto.last_name || user.last_name;
		user.phone_number = dto.phone_number || user.phone_number;
		user.gender = dto.gender || user.gender;
		user.home_town = dto.home_town || user.home_town;
		user.birth_date = dto.birth_date || user.birth_date;
		user.my_blog_or_website = dto.my_blog_or_website || user.my_blog_or_website;
		user.my_second_favourite_website =
			dto.my_second_favourite_website || user.my_second_favourite_website;
		user.my_favourite_book = dto.my_favourite_book || user.my_favourite_book;
		user.primary_language = dto.primary_language || user.primary_language;

		// Ma'lumotlarni saqlash
		await this.userRepo.save(user);

		// Muvaffaqiyatli yangilash xabarini qaytarish
		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}

	/** update user password */
	public async changePassword(dto: ChangePasswordDto, user: ExecuterEntity, lang: string) {
		if (dto.new_password !== dto.confirm_password) {
			throw new PasswordNotMatch();
		}
		const check = await this.getRepository.findOne({
			where: { email: user.email },
		});
		if (!check) {
			throw new UsernameOrPasswordIncorrect();
		}
		const hashed_password = await BcryptEncryption.encrypt(dto.new_password);
		await this.getRepository.update(check.id, { password: hashed_password });
		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}

	public async inviteToFavs(
		search_email: string,
		executer: ExecuterEntity,
		lang: string,
	): Promise<IResponse<unknown>> {
		try {
			try {
				await this.mailService.sendFavsInviteLink(search_email, executer.email);
			} catch (error) {
				throw new NotSentMessage();
			}
			const message = responseByLang("link_sent", lang);
			return { status_code: 200, data: {}, message };
		} catch (error) {
			throw error;
		}
	}
}
