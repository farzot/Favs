import { Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { AdminEntity, UserEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminRepository } from "src/core/repository";
import { AdminAlreadyExists } from "./exception/admin-already-exists";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";
import { LoginDto } from "./dto/login.dto";
import { UsernameOrPasswordIncorrect } from "./exception/username-or-password-incorrect";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { Roles } from "src/common/database/Enums";

@Injectable()
export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity> {
	constructor(
		@InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
		private readonly jwtToken: JwtToken,
	) {
		super(adminRepo, "Admin");
	}

	/** create admin */
	public async createAdmin(dto: CreateAdminDto, lang: string): Promise<IResponse<AdminEntity>> {
		const admin = await this.adminRepo.findOne({
			where: { username: dto.username, is_deleted: false },
		});

		if (admin) {
			throw new AdminAlreadyExists();
		}

		const pass = await BcryptEncryption.encrypt(dto.password);

		const new_admin = await this.adminRepo.save(
			this.adminRepo.create({ ...dto, password: pass }),
		);

		const message = responseByLang("create", lang);
		return { status_code: 201, data: new_admin, message };
	}

	/** login admin */
	public async login(dto: LoginDto): Promise<IResponse<AdminEntity | any>> {
		const admin = await this.adminRepo.findOne({
			where: { username: dto.username, is_deleted: false },
		});

		if (!admin) {
			throw new UsernameOrPasswordIncorrect();
		}

		const check = await BcryptEncryption.compare(dto.password, admin.password);

		if (!check) {
			throw new UsernameOrPasswordIncorrect();
		}
		
		const token = await this.jwtToken.generateAdminToken(admin);

		return { status_code: 200, data: { ...admin, token }, message: "success" };
	}

	/** update admin */
	public async updateAdmin(id: string, dto: UpdateAdminDto, lang: string, user: UserEntity) {
		if (dto.username) {
			const admin = await this.adminRepo.findOne({ where: { username: dto.username } });
			if (admin) {
				throw new AdminAlreadyExists();
			}
		}

		if (dto.password) {
			const pass = await BcryptEncryption.encrypt(dto.password);
			dto.password = pass;
		}

		if (user.role === Roles.SUPER_ADMIN) {
			const admin = await this.findOneById(id, lang);
			await this.adminRepo.update(id, dto);
		} else {
			const { data: admin } = await this.findOneBy(lang, {
				where: { id: user.id, is_deleted: false },
			});
			await this.adminRepo.update(admin.id, { ...dto, role: admin.role });
		}

		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}
}
