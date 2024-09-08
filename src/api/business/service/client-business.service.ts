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
import { SendMsgFromBot } from "telegram-bot-sender";
import { config } from "../../../config";

@Injectable()
export class ClientBusinessService extends BaseService<
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

	public async addBusinessRequest(
		dto: AddBusinessRequestDto,
		lang: string,
		// executer: ExecuterEntity,
	): Promise<IResponse<AddBusinessRequestEntity>> {
		console.log(dto);
		const query = this.dataSource.createQueryRunner();
		await query.connect();
		await query.startTransaction();

		try {
			// Yangi biznes yaratish
			const newRequest = new AddBusinessRequestEntity();
			newRequest.name = dto.name;
			newRequest.email = dto.email;
			newRequest.phone_number = dto.phone_number;
			newRequest.website = dto.website;
			newRequest.street_adress = dto.street_adress;
			newRequest.city = dto.city;
			newRequest.state = dto.state;
			newRequest.zip_code = dto.zip_code;
			newRequest.created_at = Date.now();
			// newRequest.owner = executer;

			// Kategoriyalarni qo'shish
			let categories: any = [];
			let category_details: string[] = [];
			console.log("Najim");
			for (const categoryId of dto.categories) {
				const category = await this.smallCategoryService.findOneById(categoryId, lang);
				categories.push(category);
				category_details.push(`${category.data.name_uz}: { "id": "${category.data.id}" }`); 
			}
			newRequest.categories = categories;

			// Yangi biznesni saqlash
			const savedRequest = await query.manager.save(AddBusinessRequestEntity, newRequest);
			console.log("Najim 22");
			await query.commitTransaction();
			const tg_message = `
  📧 *Yangi Biznes Request!*
  
  📝 *Ism*: ${dto.name}
  ☎️ *Telefon*: ${dto.phone_number}
  📧 *Email*: ${dto.email}
  🌐 *Veb-sayt*: ${dto.website}
  
  🏢 *Manzil*:
  - *Ko'cha*: ${dto.street_adress}
  - *Shahar*: ${dto.city}
  - *Viloyat*: ${dto.state}
  - *Pochta Indeksi*: ${dto.zip_code}
  
  🗂 *Kategoriyalar*:
  - ${category_details.join(` \n  - `)}
  
  Iltimos, ushbu so'rovni ko'rib chiqing!
`;

			try {
				SendMsgFromBot(
					config.BOT_TOKEN,
					config.CHAT_ID_BUSINESS_REQUEST,
					[{ key: "Yangi request", value: tg_message }],
					// "title",
				);
			} catch (error) {
				console.log("Error with SendMsgFromBot", error);
				throw error;
			}

			const message = responseByLang("create", lang);
			return { status_code: 201, data: savedRequest, message };
		} catch (error) {
			await query.rollbackTransaction();
			throw error;
		} finally {
			await query.release();
		}
	}

}
