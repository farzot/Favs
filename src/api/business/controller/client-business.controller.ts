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
} from "@nestjs/common";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { AddBusinessRequestDto } from "../dto/add-business-request.dto";
import { CurrentLanguage } from "../../../common/decorator/current-language";
import { ICurrentExecuter } from "../../../common/interface/current-executer.interface";
import { FilterDto } from "../../../common/dto/filter.dto";
import { IResponse } from "../../../common/type";
import { BusinessEntity } from "../../../core/entity";
import { Between, FindOptionsWhereProperty, ILike, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { responseByLang } from "../../../infrastructure/lib/prompts/successResponsePrompt";
import { ClientBusinessService } from "../service/client-business.service";
import { RolesGuard } from "../../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../../auth/user/AuthGuard";
import { BusinessQueryDto } from "../dto/query-business.dto";
import { CurrentExecuter } from "../../../common/decorator/current-user";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { Roles } from "../../../common/database/Enums";
import { RolesDecorator } from "../../auth/roles/RolesDecorator";
import { LocationBusinessQueryDto } from "../dto/query-business-location.dto";

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

	// gett all business with filter
	// @Get("/all")
	// public async findAll(
	// 	@CurrentLanguage() lang: string,
	// 	@Query() query: BusinessQueryDto,
	// ): Promise<IResponse<BusinessEntity[]>> {
	// 	let where_condition: FindOptionsWhereProperty<BusinessEntity> = {};
	// 	if (query?.search) {
	// 		where_condition = [
	// 			{
	// 				name: ILike(`%${query.search}%`),
	// 				is_deleted: false,
	// 			},
	// 		];
	// 	}
	// 	let { data: businesses } = await this.businessService.findAllWithPagination(lang, {
	// 		take: query.page_size,
	// 		skip: query.page,
	// 		where: where_condition,
	// 		order: { created_at: "DESC" },
	// 	});
	// 	// categories = this.businessService.filterCategoryByLang(categories, lang);
	// 	const message = responseByLang("get_all", lang);
	// 	return { status_code: 200, data: businesses, message };
	// }

	// get all business with multiple filters
	@Get("/all-with-multiple-filter")
	public async findAllWithMultipleFilter(
		@CurrentLanguage() lang: string,
		@Query() query: BusinessQueryDto,
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
			const currentDay = new Date().getDay(); // Bugungi hafta kuni
			const currentTime = new Date().toTimeString().split(" ")[0]; // Hozirgi vaqt (soat:daq)

			// Jadval bo'yicha ish vaqtlarini tekshirish
			where_condition = {
				...where_condition,
				schedules: {
					day_of_week: currentDay.toString(), // Hafta kuniga mos
					opening_time: LessThanOrEqual(currentTime), // Ish vaqti boshlangani
					closing_time: MoreThanOrEqual(currentTime), // Ish vaqti tugamagan
				},
			};
		}

		// Bizneslarni olish
		let { data: businesses } = await this.businessService.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: ["schedules"], // Kategoriyalar va jadval bilan yuklash
			order: {
				// created_at: "DESC", // Birinchi created_at bo'yicha tartiblash
				average_star: "DESC", // Keyin average_star bo'yicha
				reviews_count: "DESC", // Oxirida reviews_count bo'yicha tartiblash
			},
		});

		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: businesses, message };
	}

	// get all business with location filter
	@Get("/all-with-location-filter")
	public async findAllWithLocationFilter(
		@CurrentLanguage() lang: string,
		@Query() query: LocationBusinessQueryDto,
	): Promise<IResponse<BusinessEntity[]>> {
		let where_condition: FindOptionsWhereProperty<BusinessEntity> = { is_deleted: false };

		// Mamlakat bo'yicha filter
		// if (query?.country) {
		// 	where_condition = {
		// 		...where_condition,
		// 		country: query.country,
		// 	};
		// }

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
			const radiusInKm = query.radius; // Radius kilometrda beriladi
			const R = 6371; // Yer radiusi (km)

			// Haversine formulasi orqali masofani hisoblash
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

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_MANAGER, Roles.BUSINESS_MANAGER)
	@Get("/all-consultations")
	public async getAllConsultations(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.getAllConsultations(lang, executerPayload.executer);
	}
}
