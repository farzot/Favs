import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { BaseService } from "../../../infrastructure/lib/baseService";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessEntity } from "../../../core/entity/business.entity";
import { DataSource, FindOptionsWhereProperty, ILike, Repository } from "typeorm";
import { AddBusinessRequestDto } from "../dto/add-business-request.dto";
import {
	AddBusinessRequestEntity,
	BigCategoryEntity,
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
import { BigCategoryService } from "../../big_category/big_category.service";
import { FilterDto } from "../../../common/dto/filter.dto";
import { ConsultationRequestEntity } from "../../../core/entity/consultation.entity";
import { CreateConsultationDto } from "../dto/create-consultation.dto";

@Injectable()
export class ClientBusinessService extends BaseService<
	CreateBusinessDto,
	UpdateBusinessDto,
	BusinessEntity
> {
	constructor(
		@InjectRepository(BusinessEntity) private readonly businessRepo: Repository<BusinessEntity>,
		@InjectRepository(ConsultationRequestEntity)
		private readonly consultationRepo: Repository<ConsultationRequestEntity>,
		@Inject(forwardRef(() => SmallCategoryService))
		private smallCategoryService: SmallCategoryService,
		private readonly dataSource: DataSource,
		@Inject(forwardRef(() => BigCategoryService))
		private bigCategoryService: BigCategoryService,
	) {
		super(businessRepo, "business");
	}

	public async addBusinessRequest(
		dto: AddBusinessRequestDto,
		lang: string,
		executer: ExecuterEntity,
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
			newRequest.created_by = executer;
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
  
  �� *Request egasi!*: 
  - *Ism*: ${executer.first_name} ${executer.last_name}
  - *Phone: ${executer.phone_number}
  - *Email*: ${executer.email}

  
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

	public async searchAcrossModels(
		query: FilterDto,
		lang: string,
	): Promise<
		IResponse<{
			small_categories: SmallCategoryEntity[];
			big_categories: BigCategoryEntity[];
			businesses: BusinessEntity[];
		}>
	> {
		// Define where conditions
		const whereConditionSmallCategory: FindOptionsWhereProperty<SmallCategoryEntity> =
			query?.search
				? [
						{ name_uz: ILike(`%${query.search}%`), is_deleted: false },
						{ name_ru: ILike(`%${query.search}%`), is_deleted: false },
						{ name_en: ILike(`%${query.search}%`), is_deleted: false },
					]
				: { is_deleted: false };

		const whereConditionBigCategory: FindOptionsWhereProperty<BigCategoryEntity> = query?.search
			? [
					{ name_uz: ILike(`%${query.search}%`), is_deleted: false },
					{ name_ru: ILike(`%${query.search}%`), is_deleted: false },
					{ name_en: ILike(`%${query.search}%`), is_deleted: false },
				]
			: {};

		const whereConditionBusiness: FindOptionsWhereProperty<BusinessEntity> = query?.search
			? { name: ILike(`%${query.search}%`), is_deleted: false }
			: {};

		// Fetch data from all models
		const smallCategoriesPromise = this.smallCategoryService
			.findAllWithPagination(lang, {
				take: query.page_size,
				skip: query.page,
				where: whereConditionSmallCategory,
				relations: {},
				order: { created_at: "DESC" },
			})
			.then((result) => result.data);

		const bigCategoriesPromise = this.bigCategoryService
			.findAllWithPagination(lang, {
				take: query.page_size,
				skip: query.page,
				where: whereConditionBigCategory,
				relations: {},
				order: { created_at: "DESC" },
			})
			.then((result) => result.data);

		const businessesPromise = this.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: whereConditionBusiness,
			relations: {},
			order: { created_at: "DESC" },
		}).then((result) => result.data);

		// Wait for all data to be fetched
		const [smallCategories, bigCategories, businesses] = await Promise.all([
			smallCategoriesPromise,
			bigCategoriesPromise,
			businessesPromise,
		]);

		// Optionally, filter categories by language
		const filteredSmallCategories = this.smallCategoryService.filterCategoryByLang(
			smallCategories,
			lang,
		);
		const filteredBigCategories = this.bigCategoryService.filterCategoryByLang(
			bigCategories,
			lang,
		);

		// Create response message
		const message = responseByLang("get_all", lang);

		// Return the response
		return {
			status_code: 200,
			data: {
				small_categories: filteredSmallCategories,
				big_categories: filteredBigCategories,
				businesses: businesses,
			},
			message,
		};
	}

	public async createConsultation(
		dto: CreateConsultationDto,
		lang: string,
		executer: ExecuterEntity,
	) {
		const query = this.dataSource.createQueryRunner();
		await query.connect();
		await query.startTransaction();

		try {
			const new_request = new ConsultationRequestEntity();
			const { data: check_business } = await this.findOneById(dto.business.id, lang);
			new_request.created_at = Date.now();
			new_request.business = check_business;
			new_request.full_name = dto.full_name;
			new_request.phone = dto.phone;
			new_request.comment = dto.comment;
			new_request.created_by = executer;
			const savedRequest = await query.manager.save(ConsultationRequestEntity, new_request);
			await query.commitTransaction();
			return {
				status_code: 201,
				data: savedRequest,
				message: responseByLang("create", lang),
			};
		} catch (error) {
			await query.rollbackTransaction();
			throw error;
		} finally {
			await query.release();
		}
	}

	public async getAllConsultations(lang: string, executer: ExecuterEntity) {
		const consultations = await this.consultationRepo.findBy({
			business: executer.business[0], // bitta biznes bo'lsa, array ishlatmasdan to'g'ridan-to'g'ri shu qiymatni qo'yamiz
			is_deleted: false,
		});
		const message = responseByLang("get_all", lang);

		return { status_code: 200, data: consultations, message };
	}
}
