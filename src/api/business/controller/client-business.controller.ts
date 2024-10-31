import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
	UseInterceptors,
	UploadedFiles,
} from "@nestjs/common";
import { AddBusinessRequestDto } from "../dto/add-business-request.dto";
import { CurrentLanguage } from "../../../common/decorator/current-language";
import { ICurrentExecuter } from "../../../common/interface/current-executer.interface";
import { FilterDto } from "../../../common/dto/filter.dto";
import { IResponse } from "../../../common/type";
import { BusinessEntity } from "../../../core/entity";
import {
	Between,
	FindOptionsWhereProperty,
	ILike,
	LessThanOrEqual,
	MoreThanOrEqual,
} from "typeorm";
import { responseByLang } from "../../../infrastructure/lib/prompts/successResponsePrompt";
import { ClientBusinessService } from "../service/client-business.service";
import { RolesGuard } from "../../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../../auth/user/AuthGuard";
import { BusinessQueryDto } from "../dto/query-business.dto";
import { CurrentExecuter } from "../../../common/decorator/current-user";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { PhotoType, Roles } from "../../../common/database/Enums";
import { RolesDecorator } from "../../auth/roles/RolesDecorator";
import { LocationBusinessQueryDto } from "../dto/query-business-location.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateBusinessPhotoDto } from "../../business_photos/dto/create-business_photo.dto";
import { AddBusinessPhotoDto } from "../dto/add-business-photo.dto";
import { UpdateBusinessPhotoTypeDto } from "../dto/update-add-business-photo.dto";
import { BusinessNotFound } from "../exception/not-found";
import { CombinedBusinessQueryDto } from "../dto/combined-business-query.dto";
import { ShareBusinessDto } from "../dto/share-business.dto";
import { UpdateBusinessMainImagesDto } from "../dto/update-main-photos.dto";
import { UpdateBusinessPhotoTypesDto } from "../dto/update-business-photo-types.dto";
import { UpdateBusinessByBusAdmins } from "../dto/update-business.dto";

@Controller("/client/business")
export class ClientBusinessController {
	constructor(private readonly businessService: ClientBusinessService) {}

	// add-business-request api, business create qilish uchun jo'natiladigan request
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/add-business-request")
	public async addBusinessRequest(
		@Body() dto: AddBusinessRequestDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.addBusinessRequest(dto, lang, executerPayload.executer);
	}

	// get all business with multiple filters
	@Get("/all-with-filters")
	public async findAllWithFilters(
		@CurrentLanguage() lang: string,
		@Query() query: CombinedBusinessQueryDto,
	): Promise<IResponse<BusinessEntity[]>> {
		let where_condition: FindOptionsWhereProperty<BusinessEntity> = { is_deleted: false };

		// Search bo'yicha filter
		if (query?.search) {
			where_condition = [
				{
					name: ILike(`%${query.search}%`),
					is_deleted: false,
				},
			];
		}

		// Category ID bo'yicha filter
		if (query?.category_id) {
			where_condition = {
				...where_condition,
				categories: {
					id: query.category_id,
				},
			};
		}

		// is_delivery_available bo'yicha filter
		if (query?.is_delivery_available) {
			where_condition = {
				...where_condition,
				is_delivery_available: query.is_delivery_available == true,
			};
		}

		// is_reservation_available bo'yicha filter
		if (query?.is_reservation_available) {
			where_condition = {
				...where_condition,
				is_reservation_available: query.is_reservation_available == true,
			};
		}

		// is_wifi_available bo'yicha filter
		if (query?.is_wifi_available) {
			where_condition = {
				...where_condition,
				is_wifi_available: query.is_wifi_available == true,
			};
		}

		// is_claimed bo'yicha filter
		if (query?.is_claimed) {
			where_condition = {
				...where_condition,
				is_claimed: query.is_claimed == true,
			};
		}

		// is_recommended bo'yicha filter
		if (query?.is_recommended) {
			where_condition = {
				...where_condition,
				is_recommended: query.is_recommended == true,
			};
		}

		// Agar open property mavjud bo'lsa
		if (query?.open) {
			const currentDay = new Date().getDay();
			const currentTime = new Date().toTimeString().split(" ")[0];

			where_condition = {
				...where_condition,
				schedules: {
					day_of_week: currentDay.toString(),
					opening_time: LessThanOrEqual(currentTime),
					closing_time: MoreThanOrEqual(currentTime),
				},
			};
		}

		// Shahar bo'yicha filter
		if (query?.city) {
			where_condition = {
				...where_condition,
				city: query.city,
			};
		}

		// Davlat bo'yicha filter
		if (query?.state) {
			where_condition = {
				...where_condition,
				state: query.state,
			};
		}

		// Koordinatalar bo'yicha filter (radius bo'yicha)
		if (query?.latitude && query?.longitude && query?.radius) {
			const radiusInKm = query.radius;
			const R = 6371;

			where_condition = {
				...where_condition,
				latitude: Between(query.latitude - radiusInKm / R, query.latitude + radiusInKm / R),
				longitude: Between(
					query.longitude - radiusInKm / (R * Math.cos((query.latitude * Math.PI) / 180)),
					query.longitude + radiusInKm / (R * Math.cos((query.latitude * Math.PI) / 180)),
				),
			};
		}

		// Bizneslarni olish
		let { data: businesses } = await this.businessService.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: ["schedules"],
			order: {
				average_star: "DESC",
				reviews_count: "DESC",
			},
		});

		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: businesses, message };
	}

	// @Get("/all-with-multiple-filter")
	// public async findAllWithMultipleFilter(
	// 	@CurrentLanguage() lang: string,
	// 	@Query() query: BusinessQueryDto,
	// ): Promise<IResponse<BusinessEntity[]>> {
	// 	let where_condition: FindOptionsWhereProperty<BusinessEntity> = { is_deleted: false };

	// 	// Search bo'yicha filter
	// 	if (query?.search) {
	// 		where_condition = [
	// 			{
	// 				name: ILike(`%${query.search}%`),
	// 				is_deleted: false,
	// 			},
	// 		];
	// 	}

	// 	// Category ID bo'yicha filter
	// 	if (query?.category_id) {
	// 		where_condition = {
	// 			...where_condition,
	// 			categories: {
	// 				id: query.category_id,
	// 			},
	// 		};
	// 	}

	// 	// is_delivery_available bo'yicha filter
	// 	if (query?.is_delivery_available) {
	// 		where_condition = {
	// 			...where_condition,
	// 			is_delivery_available: query.is_delivery_available == true,
	// 		};
	// 	}

	// 	// is_reservation_available bo'yicha filter
	// 	if (query?.is_reservation_available) {
	// 		where_condition = {
	// 			...where_condition,
	// 			is_reservation_available: query.is_reservation_available == true,
	// 		};
	// 	}

	// 	// is_wifi_available bo'yicha filter
	// 	if (query?.is_wifi_available) {
	// 		where_condition = {
	// 			...where_condition,
	// 			is_wifi_available: query.is_wifi_available == true,
	// 		};
	// 	}

	// 	// is_claimed bo'yicha filter
	// 	if (query?.is_claimed) {
	// 		where_condition = {
	// 			...where_condition,
	// 			is_claimed: query.is_claimed == true,
	// 		};
	// 	}

	// 	// is_recommended bo'yicha filter
	// 	if (query?.is_recommended) {
	// 		where_condition = {
	// 			...where_condition,
	// 			is_recommended: query.is_recommended == true,
	// 		};
	// 	}

	// 	// Agar open property mavjud bo'lsa
	// 	if (query?.open) {
	// 		const currentDay = new Date().getDay(); // Bugungi hafta kuni
	// 		const currentTime = new Date().toTimeString().split(" ")[0]; // Hozirgi vaqt (soat:daq)

	// 		// Jadval bo'yicha ish vaqtlarini tekshirish
	// 		where_condition = {
	// 			...where_condition,
	// 			schedules: {
	// 				day_of_week: currentDay.toString(), // Hafta kuniga mos
	// 				opening_time: LessThanOrEqual(currentTime), // Ish vaqti boshlangani
	// 				closing_time: MoreThanOrEqual(currentTime), // Ish vaqti tugamagan
	// 			},
	// 		};
	// 	}

	// 	// Bizneslarni olish
	// 	let { data: businesses } = await this.businessService.findAllWithPagination(lang, {
	// 		take: query.page_size,
	// 		skip: query.page,
	// 		where: where_condition,
	// 		relations: ["schedules"], // Kategoriyalar va jadval bilan yuklash
	// 		order: {
	// 			// created_at: "DESC", // Birinchi created_at bo'yicha tartiblash
	// 			average_star: "DESC", // Keyin average_star bo'yicha
	// 			reviews_count: "DESC", // Oxirida reviews_count bo'yicha tartiblash
	// 		},
	// 	});

	// 	const message = responseByLang("get_all", lang);
	// 	return { status_code: 200, data: businesses, message };
	// }

	// // get all business with location filter
	// @Get("/all-with-location-filter")
	// public async findAllWithLocationFilter(
	// 	@CurrentLanguage() lang: string,
	// 	@Query() query: LocationBusinessQueryDto,
	// ): Promise<IResponse<BusinessEntity[]>> {
	// 	let where_condition: FindOptionsWhereProperty<BusinessEntity> = { is_deleted: false };

	// 	// Mamlakat bo'yicha filter
	// 	// if (query?.country) {
	// 	// 	where_condition = {
	// 	// 		...where_condition,
	// 	// 		country: query.country,
	// 	// 	};
	// 	// }

	// 	// Shahar bo'yicha filter
	// 	if (query?.city) {
	// 		where_condition = {
	// 			...where_condition,
	// 			city: query.city,
	// 		};
	// 	}

	// 	// Davlat bo'yicha filter
	// 	if (query?.state) {
	// 		where_condition = {
	// 			...where_condition,
	// 			state: query.state,
	// 		};
	// 	}

	// 	// Koordinatalar bo'yicha filter (radius bo'yicha)
	// 	if (query?.latitude && query?.longitude && query?.radius) {
	// 		const radiusInKm = query.radius; // Radius kilometrda beriladi
	// 		const R = 6371; // Yer radiusi (km)

	// 		// Haversine formulasi orqali masofani hisoblash
	// 		where_condition = {
	// 			...where_condition,
	// 			latitude: Between(query.latitude - radiusInKm / R, query.latitude + radiusInKm / R),
	// 			longitude: Between(
	// 				query.longitude - radiusInKm / (R * Math.cos((query.latitude * Math.PI) / 180)),
	// 				query.longitude + radiusInKm / (R * Math.cos((query.latitude * Math.PI) / 180)),
	// 			),
	// 		};
	// 	}

	// 	// Bizneslarni olish
	// 	let { data: businesses } = await this.businessService.findAllWithPagination(lang, {
	// 		take: query.page_size,
	// 		skip: query.page,
	// 		where: where_condition,
	// 		relations: ["schedules"],
	// 		order: {
	// 			average_star: "DESC",
	// 			reviews_count: "DESC",
	// 		},
	// 	});

	// 	const message = responseByLang("get_all", lang);
	// 	return { status_code: 200, data: businesses, message };
	// }

	// get by business_id
	@Get(":id")
	public async findById(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return await this.businessService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	// get all categories and business with filter in one api call
	@Get("/search-across-models")
	public async searchAcrossModels(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.businessService.searchAcrossModels(query, lang);
	}

	// create consultation
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/consultation")
	public async createConsultation(
		@Body() dto: CreateConsultationDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.createConsultation(dto, lang, executerPayload.executer);
	}

	// get all consultations by business id in admin dashboard
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Get("/self/all-consultations")
	public async getAllConsultations(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const business_id = executerPayload.executer.business[0]?.id;
		if (!business_id) {
			throw new BusinessNotFound();
		}
		return this.businessService.getAllConsultations(lang, business_id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Get("/self/business-info")
	public async getSelfBusinessInfo(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const business_id = executerPayload.executer.business[0]?.id;
		if (!business_id) {
			throw new BusinessNotFound();
		}
		console.log("business_id", business_id)
		return await this.businessService.getSelfBusinessInfo(lang, business_id);
	}

	// add business photo to business
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER, Roles.BUSINESS_MANAGER, Roles.BUSINESS_OWNER)
	@Post("/add-photo")
	@UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 4 }]))
	async addPhotoToBusiness(
		@Body() dto: AddBusinessPhotoDto,
		@UploadedFiles()
		files: { images: Express.Multer.File[] },
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.businessService.addBusinessPhoto(dto, files, executerPayload.executer, lang);
	}

	// update business photo-type by admin
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Patch("/update-photo-type/by-admin")
	public async updatePhotoType(
		@Body() dto: UpdateBusinessPhotoTypeDto,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		const business_id = executerPayload.executer.business[0]?.id;
		if (!business_id) {
			throw new BusinessNotFound();
		}
		await this.businessService.findOneById(business_id, lang, {
			where: { is_deleted: false, is_active: true },
		});
		return this.businessService.updateBusinessPhotoType(
			dto,
			business_id,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Patch("/update-multiple-photo-types/by-admin")
	public async updatePhotoTypes(
		@Body() dto: UpdateBusinessPhotoTypesDto,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		const business_id = executerPayload.executer.business[0]?.id;
		if (!business_id) {
			throw new BusinessNotFound();
		}

		// Biznesni tekshirish
		await this.businessService.findOneById(business_id, lang, {
			where: { is_deleted: false, is_active: true },
		});

		return this.businessService.updateBusinessPhotoTypes(
			dto,
			business_id,
			executerPayload.executer,
			lang,
		);
	}

	// get all business photos by business id and type
	@Get("/photos/:business_id")
	public async getPhotosByType(
		@Param("business_id") business_id: string,
		@Query("photo_type") type: PhotoType,
		@CurrentLanguage() lang: string,
	) {
		return this.businessService.getAllBusinessPhotosByType(business_id, type, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/share-business")
	public async shareBusiness(
		@Body() dto: ShareBusinessDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.businessService.shareBusinessByEmail(dto, executerPayload.executer, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_MANAGER, Roles.BUSINESS_OWNER)
	@Patch("/set-main-images")
	public async setMainImages(
		@Body() dto: UpdateBusinessMainImagesDto,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		const business_id = executerPayload.executer.business[0]?.id;
		if (!business_id) {
			throw new BusinessNotFound();
		}
		return this.businessService.setBusinessMainImages(
			dto.photo_ids,
			business_id,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_MANAGER, Roles.BUSINESS_OWNER)
	@Patch("/update/business-availabilities")
	public async updateBusinessAvailabilities(
		@Body() dto: UpdateBusinessByBusAdmins,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		const business_id = executerPayload.executer.business[0]?.id;
		if (!business_id) {
			throw new BusinessNotFound();
		}
		return this.businessService.updateBusinessAvailabilities(
			business_id,
			dto,
			executerPayload.executer,
			lang,
		);
	}
}
