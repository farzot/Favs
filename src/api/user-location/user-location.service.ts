import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity, UserLocationEntity } from "src/core/entity";
import { UserLocationRepository } from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateUserLocationDto } from "./dto/create-user-location.dto";
import { UpdateUserLocationDto } from "./dto/update-user-location.dto";
import { IResponse } from "src/common/type";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";

@Injectable()
export class UserLocationService extends BaseService<
	CreateUserLocationDto,
	UpdateUserLocationDto,
	UserLocationEntity
> {
	constructor(
		@InjectRepository(UserLocationEntity)
		private readonly userLocationRepo: UserLocationRepository,
	) {
		super(userLocationRepo, "user location");
	}

	public async createUserLocation(
		dto: CreateUserLocationDto,
		lang: string,
		user: UserEntity,
	): Promise<IResponse<UserLocationEntity>> {
				const location = await this.userLocationRepo.findOne({
			where: { user, is_main: true, is_deleted: false },
		});

		if (location) {
			await this.userLocationRepo.update(location.id, { is_main: false });
		}

		const new_location = await this.userLocationRepo.save(this.userLocationRepo.create({...dto, user}));

		const message = responseByLang("create", lang);
		return { status_code: 201, data: new_location, message };
	}

	public async addUserLocation(
		dto: CreateUserLocationDto,
		lang: string,
		user: UserEntity,
	): Promise<IResponse<UserLocationEntity>> {
		const location = await this.userLocationRepo.findOne({
			where: { user, is_deleted: false },
		});

		const new_location = await this.userLocationRepo.save(
			this.userLocationRepo.create({ ...dto, user }),
		);

		const message = responseByLang("create", lang);
		return { status_code: 201, data: new_location, message };
	}

	public async updateUserLocation(
		id: string,
		dto: UpdateUserLocationDto,
		lang: string,
		user: UserEntity,
	): Promise<IResponse<[]>> {
		const location = await this.findOneById(id, lang, { where: { user, is_deleted: false } });

		if (dto.is_main) {
			await this.userLocationRepo.update(
				{ user, is_main: true, is_deleted: false },
				{ is_main: false },
			);
		}

		await this.update(id, dto, lang);
		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}
}
