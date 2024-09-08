import { Injectable } from "@nestjs/common";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { BaseService } from "../../../infrastructure/lib/baseService";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessEntity } from "../../../core/entity/business.entity";
import { DataSource, Repository } from "typeorm";
import { AddBusinessRequestDto } from "../dto/add-business-request.dto";
import {
	AddBusinessRequestEntity,
	ExecuterEntity,
	SmallCategoryEntity,
} from "../../../core/entity";
import { SmallCategoryRepository } from "../../../core/repository";
import { SmallCategoryService } from "../../small_category/small_category.service";
import { IResponse } from "../../../common/type";
import { responseByLang } from "../../../infrastructure/lib/prompts/successResponsePrompt";
import { Roles } from "../../../common/database/Enums";
import { BcryptEncryption } from "../../../infrastructure/lib/bcrypt";

@Injectable()
export class AdminBusinessService extends BaseService<
	CreateBusinessDto,
	UpdateBusinessDto,
	BusinessEntity
> {
	constructor(
		@InjectRepository(BusinessEntity) private readonly businessRepo: Repository<BusinessEntity>,
		// @InjectRepository(SmallCategoryEntity)
		// private readonly smallCategoryRepo: SmallCategoryRepository,
		private readonly smallCategoryService: SmallCategoryService,
		private readonly dataSource: DataSource,
	) {
		super(businessRepo, "business");
	}

	public async createBusiness(
		dto: CreateBusinessDto,
		lang: string = "ru",
		executer: ExecuterEntity,
	): Promise<IResponse<BusinessEntity>> {
		const query = this.dataSource.createQueryRunner();
		await query.connect();
		await query.startTransaction();

		try {
			// Yangi executer yaratish
			const newExecuter = new ExecuterEntity();
			newExecuter.first_name = dto.first_name; // Dto'da kerakli maydonlar qo'shilgan deb faraz qilamiz
			newExecuter.last_name = dto.last_name;
			newExecuter.gender = dto.gender;
			newExecuter.phone_number = dto.phone_number;
			newExecuter.birth_date = dto.birth_date;
			newExecuter.role = Roles.BUSINESS_OWNER; // Rolni to'g'ri belgilang
			newExecuter.created_by = executer;
			newExecuter.username = dto.username;
			newExecuter.password = await BcryptEncryption.encrypt(dto.password);

			await query.manager.save("executers", newExecuter);

			// Yangi biznes yaratish
			const newBusiness = new BusinessEntity();
			newBusiness.name = dto.name;
			newBusiness.email = dto.email;
			newBusiness.phone_number = dto.phone_number;
			newBusiness.website = dto.website;
			newBusiness.stir_number = dto.stir_number;
			newBusiness.street_adress = dto.street_adress;
			newBusiness.city = dto.city;
			newBusiness.state = dto.state;
			newBusiness.zip_code = dto.zip_code;
			newBusiness.latitude = dto.latitude;
			newBusiness.is_claimed = dto.is_claimed;
			newBusiness.created_by = executer;
			newBusiness.owner = newExecuter; // Biznesni yangi yaratilgan executerga bog'lash

			// Kategoriyalarni qo'shish
			let categories: any = [];
			for (const categoryId of dto.categories) {
				const category = await this.smallCategoryService.findOneById(lang, categoryId);
				if (!category) {
					throw new Error(`Category with ID ${categoryId} not found`);
				}
				categories.push(category);
			}
			newBusiness.categories = categories;

			// Yangi biznesni saqlash
			await query.manager.save("businesses", newBusiness);

			await query.commitTransaction();

			const message = responseByLang("create", lang);
			return { status_code: 201, data: newBusiness, message };
		} catch (error) {
			await query.rollbackTransaction();
			throw error;
		} finally {
			await query.release();
		}
	}
}
