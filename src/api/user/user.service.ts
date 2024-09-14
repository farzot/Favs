import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
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
import { PasswordNotMatch, UsernameOrPasswordIncorrect } from "../auth/exception";

@Injectable()
export class UserService extends BaseService<CreateUserDto, UpdateUserDto, ExecuterEntity> {
	constructor(
		@InjectRepository(ExecuterEntity) private readonly userRepo: ExecuterRepository,
		private readonly jwtToken: JwtToken,
	) {
		super(userRepo, "user");
	}

	// public async createUser(dto: CreateUserDto, lang: string): Promise<IResponse<unknown>> {
	// 	const otp = await this.otpRepo.findOne({
	// 		where: { phone_number: dto.phone_number, otp_code: dto.otp_code, is_verified: true },
	// 	});

	// 	if (!otp) {
	// 		throw new NotVerifiedUser();
	// 	}

	// 	const user = this.userRepo.create(dto);

	// 	const new_user: ExecuterEntity = await this.userRepo.save({ ...user });
	// 	const token = await this.jwtToken.generateToken(new_user);

	// 	const hashed_token = await BcryptEncryption.encrypt(token.refresh_token);
	// 	new_user.hashed_token = hashed_token;

	// 	await this.userRepo.save(new_user);
	// 	await this.otpRepo.delete(otp.id);
	// 	const message = responseByLang("create", lang);

	// 	return { status_code: 201, data: { ...new_user, token }, message };
	// }

	/** update user self informations */
	public async updateUserSelfInfo(
		dto: UpdateUserDto,
		lang: string,
		user: ExecuterEntity,
	): Promise<IResponse<[]>> {
		user.first_name = dto.first_name || user.first_name;
		user.last_name = dto.last_name || user.last_name;

		await this.userRepo.save(user);

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
		await this.getRepository.update(check.id, { password: dto.new_password });
		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
