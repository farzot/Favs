import { Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { ExecuterEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ExecuterRepository } from "src/core/repository";
import { AdminAlreadyExists } from "./exception/admin-already-exists";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";
import { LoginDto } from "./dto/login.dto";
import { UsernameOrPasswordIncorrect } from "./exception/username-or-password-incorrect";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { Roles } from "src/common/database/Enums";
import { config } from "../../config";

@Injectable()
export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, ExecuterEntity> {
	constructor(
		@InjectRepository(ExecuterEntity) private readonly executerRepo: ExecuterRepository,
		private readonly jwtToken: JwtToken,
	) {
		super(executerRepo, "Admin");
	}
	public async createSuperAdmin(dto: CreateAdminDto, lang: string) {
		console.log(`Service kirish`);
		let pass = await BcryptEncryption.encrypt(dto.password);
		const new_admin = this.getRepository.create({ ...dto, password: pass });
		// new_admin.created_by = this.getRepository.create({ role: Roles.SUPER_ADMIN });
		new_admin.created_at = Date.now();
		await this.getRepository.save(new_admin);
		const message = responseByLang("create", lang);
		return { status_code: 201, data: new_admin, message };
	}

	/** create admin */
	public async createAdmin(
		dto: CreateAdminDto,
		lang: string,
		executer: ExecuterEntity,
	): Promise<IResponse<ExecuterEntity>> {
		console.log(`Server api ichi`)
		const admin = await this.executerRepo.findOne({
			where: { username: dto.username, email: dto.email, is_deleted: false },
		});

		if (admin) {
			throw new AdminAlreadyExists();
		}

		let pass = await BcryptEncryption.encrypt(dto.password);
		const new_admin = this.getRepository.create({ ...dto, password: pass });
		new_admin.created_by = executer;
		new_admin.created_at = Date.now();
		await this.executerRepo.save(new_admin);

		const message = responseByLang("create", lang);
		return { status_code: 201, data: new_admin, message };
	}

	/** login admin */
	public async login(dto: LoginDto): Promise<IResponse<ExecuterEntity | any>> {
		const admin = await this.executerRepo.findOne({
			where: { username: dto.username, is_deleted: false },
		});

		if (!admin) {
			throw new UsernameOrPasswordIncorrect();
		}

		const check = await BcryptEncryption.compare(dto.password, admin.password);

		if (!check) {
			throw new UsernameOrPasswordIncorrect();
		}
		const token = await this.jwtToken.generateToken(
			admin,
			config.ACCESS_EXPIRE_TIME,
			config.ACCESS_SECRET_KEY,
		);

		return { status_code: 200, data: { token }, message: "success" };
	}

	/** update admin */
	public async updateAdmin(id: string, dto: UpdateAdminDto, lang: string, user: ExecuterEntity) {
		if (dto.username) {
			const admin = await this.executerRepo.findOne({ where: { username: dto.username } });
			if (admin) {
				throw new AdminAlreadyExists();
			}
		}
		if (dto.password) {
			const pass = await BcryptEncryption.encrypt(dto.password);
			dto.password = pass;
		}

		if (user.role === Roles.SUPER_ADMIN) {
			await this.findOneById(id, lang, { where: { is_deleted: false } });
			return await this.update(id, dto, lang, user);
		} else {
			const { data: admin } = await this.findOneBy(lang, {
				where: { id: user.id, is_deleted: false },
			});
			return await this.update(admin.id, dto, lang, user);
		}

		// const message = responseByLang("update", lang);
		// return { status_code: 200, data: [], message };
	}
}
