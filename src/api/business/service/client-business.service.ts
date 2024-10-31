import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessByBusAdmins, UpdateBusinessDto } from "../dto/update-business.dto";
import { BaseService } from "../../../infrastructure/lib/baseService";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessEntity } from "../../../core/entity/business.entity";
import { DataSource, FindOptionsWhereProperty, ILike, In, Repository } from "typeorm";
import { AddBusinessRequestDto } from "../dto/add-business-request.dto";
import {
	AddBusinessRequestEntity,
	BigCategoryEntity,
	BusinessPhotosEntity,
	ExecuterEntity,
	SmallCategoryEntity,
} from "../../../core/entity";
import { SmallCategoryRepository } from "../../../core/repository";
import { SmallCategoryService } from "../../small_category/small_category.service";
import { IResponse } from "../../../common/type";
import { responseByLang } from "../../../infrastructure/lib/prompts/successResponsePrompt";
import { PhotoType, Roles } from "../../../common/database/Enums";
import { BcryptEncryption } from "../../../infrastructure/lib/bcrypt";
import { SendMsgFromBot } from "telegram-bot-sender";
import { config } from "../../../config";
import { BigCategoryService } from "../../big_category/big_category.service";
import { FilterDto } from "../../../common/dto/filter.dto";
import { ConsultationRequestEntity } from "../../../core/entity/consultation.entity";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { AddBusinessPhotoDto } from "../dto/add-business-photo.dto";
import { createFile } from "../../../infrastructure/lib/fileService";
import { UpdateBusinessPhotoTypeDto } from "../dto/update-add-business-photo.dto";
import { MailService } from "../../mail/mail.service";
import { ShareBusiness, ShareBusinessDto } from "../dto/share-business.dto";
import { BusinessNotFound } from "../exception/not-found";
import { SomePhotosNotFound } from "../exception/photos-not-found.exception";
import { UpdateBusinessPhotoTypesDto } from "../dto/update-business-photo-types.dto";
import { Forbidden } from "../../auth/exception";

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
		private readonly mailService: MailService,
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

	// Create consultation by client
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

	// Business Admin panelida businessga tegishli barcha consultatsiyalarni olish
	public async getAllConsultations(lang: string, business_id: string) {
		const consultations = await this.consultationRepo.findBy({
			business: { id: business_id }, // bitta biznes bo'lsa, array ishlatmasdan to'g'ridan-to'g'ri shu qiymatni qo'yamiz
			is_deleted: false,
		});
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: consultations, message };
	}

	public async getSelfBusinessInfo(lang: string, business_id: string) {
		const founded_business = await this.findOneById(business_id, lang, {
			where: { is_deleted: false },
		});
		const message = responseByLang("success", lang);
		return { status_code: 200, data: founded_business, message };
	}

	// Business ga photo qo'shish client tomonidan
	public addBusinessPhoto(
		dto: AddBusinessPhotoDto,
		files: any,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Business ni topish
				const { data: business } = await this.findOneById(dto.business.id, lang, {
					where: { is_deleted: false },
				});

				// Fayllar mavjud bo'lsa
				if (files.images && files.images.length > 0) {
					let savedPhotos: BusinessPhotosEntity[] = [];

					// Har bir rasm uchun yangi BusinessPhoto yaratish
					for (const image of files.images) {
						const new_photo = new BusinessPhotosEntity();
						new_photo.business = business;
						new_photo.caption = dto.caption;

						// Faylni yuklash va nomini olish
						const uploaded_file_name = await createFile(image);

						// Yaratilgan rasm fayli nomini yozish
						new_photo.image_url = uploaded_file_name;
						new_photo.created_at = Date.now();

						// Har bir rasmni saqlash
						const savedPhoto = await query.manager.save(
							BusinessPhotosEntity,
							new_photo,
						);
						savedPhoto.created_by = executer;
						savedPhotos.push(savedPhoto);
					}

					// Tranzaktsiyani yakunlash
					await query.commitTransaction();

					resolve({
						status_code: 201,
						data: savedPhotos,
						message: responseByLang("create", lang),
					});
				} else {
					// Agar rasm yuklanmagan bo'lsa, xato qaytarish
					throw new Error("No images provided");
				}
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// Business Admin panelida photo type ni update qilish
	public async updateBusinessPhotoType(
		dto: UpdateBusinessPhotoTypeDto,
		business_id: string,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Find the existing photo
				const existing_photo = await query.manager.findOne(BusinessPhotosEntity, {
					where: { id: dto.photo_id, is_deleted: false, business: { id: business_id } },
				});

				if (!existing_photo) {
					throw new Error(responseByLang("not_found", lang));
				}

				// Update photo_type
				existing_photo.photo_type = dto.photo_type;
				existing_photo.updated_at = Date.now();
				existing_photo.updated_by = executer;

				const updatedPhoto = await query.manager.save(BusinessPhotosEntity, existing_photo);

				await query.commitTransaction();

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("update", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// Business admin panelida bir nechta photolarni type ni update qilish
	public async updateBusinessPhotoTypes(
		dto: UpdateBusinessPhotoTypesDto,
		business_id: string,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Kiritilgan fotosuratlarni topish
				const existing_photos = await query.manager.find(BusinessPhotosEntity, {
					where: {
						id: In(dto.photo_ids),
						is_deleted: false,
						business: { id: business_id },
					},
				});

				const existingPhotoIds = existing_photos.map((photo) => photo.id);

				// Kiritilgan barcha photo_ids database'da mavjudligini tekshirish
				const missingPhotos = dto.photo_ids.filter((id) => !existingPhotoIds.includes(id));

				if (missingPhotos.length > 0) {
					throw new SomePhotosNotFound();
				}

				// Har bir fotosurat turini yangilash
				existing_photos.forEach((photo) => {
					photo.photo_type = dto.photo_type;
					photo.updated_at = Date.now();
					photo.updated_by = executer;
				});

				await query.manager.save(BusinessPhotosEntity, existing_photos);

				await query.commitTransaction();

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("update", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// business ga tegishli photo larni type orqali get qilish
	public async getAllBusinessPhotosByType(
		business_id: string,
		photo_type: PhotoType | null, // PhotoType null bo'lishi mumkinligini ko'rsatish
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				let photos: BusinessPhotosEntity[] = [];
				console.log(photo_type);
				// photo_type aniq bo'lsa, faqat o'sha turdagi photolarni qidiradi
				if (photo_type) {
					photos = await query.manager.find(BusinessPhotosEntity, {
						where: {
							business: { id: business_id },
							photo_type: photo_type,
							is_deleted: false,
						},
						order: {
							created_at: "DESC", // Tartibni sozlash mumkin
						},
					});
					console.log("photos_1", photos);
				} else {
					// Aks holda barcha photolarni qaytaradi
					photos = await query.manager.find(BusinessPhotosEntity, {
						where: {
							business: { id: business_id },
							is_deleted: false,
						},
						order: {
							created_at: "DESC", // Tartibni sozlash mumkin
						},
					});
					console.log("photos_2", photos);
				}

				// Agar hech qanday photo topilmasa, bo'sh array qaytarish
				if (!photos.length) {
					photos = [];
					console.log("photos_3", photos);
				}
				resolve({
					status_code: 200,
					data: photos,
					message: responseByLang("get_all", lang),
				});
			} catch (error) {
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// client business ni email orqali share qilish zaprozi
	public async shareBusinessByEmail(
		dto: ShareBusinessDto,
		executer: ExecuterEntity,
		lang: string,
	) {
		const { data: business } = await this.findOneById(dto.business_id, lang, {
			where: { is_deleted: false },
			relations: { photos: true, categories: true },
		});
		// Null yoki undefined holatini tekshirish
		const business_categories = business.categories
			? business.categories.map((cat) => cat.name_en).join(", ")
			: ""; // Agar category yo'q bo'lsa, bo'sh string
		const inviteData = new ShareBusiness();
		inviteData.sender = executer.first_name;
		// main_images massivini tekshirish
		inviteData.business_image =
			business.main_images && business.main_images.length > 0 ? business.main_images[0] : " "; // main_images bo'lmasa null qaytarish
		console.log(inviteData.business_image);
		// inviteData.business_image = business.main_images[0];
		inviteData.business_name = business.name;
		inviteData.message = dto.message;
		inviteData.business_rating = business.average_star;
		inviteData.business_reviews = business.reviews_count;
		inviteData.business_link = `localhost:${config.PORT}/api/client/business/${business.id}`;
		inviteData.recipient_email = dto.recipient_email;
		inviteData.email_preferences_link = `favs.uz`;
		inviteData.business_categories = business_categories;
		inviteData.sender_link = `localhost:${config.PORT}/api/executer/${executer.id}`;
		await this.mailService.sendBusinessInviteEmail(dto.recipient_email, inviteData);
		return { status_code: 200, data: [], message: responseByLang("success", lang) };
	}

	// Business admin panelida picturelarni main qilish
	public async setBusinessMainImages(
		photo_ids: string[],
		business_id: string,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Find the existing business and check for valid photo IDs in one query
				const [business, existingPhotos] = await Promise.all([
					query.manager.findOne(BusinessEntity, {
						where: { id: business_id, is_deleted: false },
					}),
					query.manager.find(BusinessPhotosEntity, {
						where: {
							id: In(photo_ids),
							is_deleted: false,
							business: { id: business_id, is_deleted: false },
						},
					}),
				]);

				if (!business) {
					throw new BusinessNotFound();
				}

				if (existingPhotos.length !== photo_ids.length) {
					throw new SomePhotosNotFound();
				}

				let images_list: string[] = [];
				existingPhotos.forEach((photo) => {
					images_list.push(photo.image_url);
				});

				// Set main_images to the valid photo URLs
				business.main_images = images_list;
				business.updated_at = new Date().getTime(); // Convert Date to timestamp in milliseconds
				business.updated_by = executer;

				await query.manager.save(BusinessEntity, business);

				await query.commitTransaction();

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("update", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// business Adminlari tomonidan businessga tegishli ma'lum o'zgaruvchilarni update qilish
	public async updateBusinessAvailabilities(
		business_id: string,
		dto: UpdateBusinessByBusAdmins,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();

		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Biznesni topish
				const business = await query.manager.findOne(BusinessEntity, {
					where: { id: business_id, is_deleted: false },
				});

				if (!business) {
					throw new BusinessNotFound();
				}

				// Faqat BUSINESS_OWNER va BUSINESS_MANAGER rollariga ega bo'lganlar ruxsat oladi
				if (![Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER].includes(executer.role)) {
					throw new Forbidden();
				}

				// Yangilanishlar qo'llanilmoqda
				if (dto.is_delivery_available !== undefined) {
					business.is_delivery_available = dto.is_delivery_available;
				}
				if (dto.is_checkout_available !== undefined) {
					business.is_checkout_available = dto.is_checkout_available;
				}
				if (dto.is_reservation_available !== undefined) {
					business.is_reservation_available = dto.is_reservation_available;
				}
				if (dto.is_reservation_blocked !== undefined) {
					business.is_reservation_blocked = dto.is_reservation_blocked;
				}
				if (dto.reservation_deposit_amount !== undefined) {
					business.reservation_deposit_amount = dto.reservation_deposit_amount;
				}

				// Yangilash vaqti va kim tomonidan yangilanganini belgilash
				business.updated_at = new Date().getTime();
				business.updated_by = executer;

				// BusinessEntity ni saqlash
				await query.manager.save(BusinessEntity, business);

				await query.commitTransaction();

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("update", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}
}
