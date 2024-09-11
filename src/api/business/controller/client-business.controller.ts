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
import { FindOptionsWhereProperty, ILike } from "typeorm";
import { responseByLang } from "../../../infrastructure/lib/prompts/successResponsePrompt";
import { ClientBusinessService } from "../service/client-business.service";
import { RolesGuard } from "../../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../../auth/user/AuthGuard";
import { BusinessQueryDto } from "../dto/query-business.dto";
import { CurrentExecuter } from "../../../common/decorator/current-user";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { Roles } from "../../../common/database/Enums";
import { RolesDecorator } from "../../auth/roles/RolesDecorator";

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
	@Get("/all")
	public async findAll(
		@CurrentLanguage() lang: string,
		@Query() query: BusinessQueryDto,
	): Promise<IResponse<BusinessEntity[]>> {
		let where_condition: FindOptionsWhereProperty<BusinessEntity> = {};
		if (query?.search) {
			where_condition = [
				{
					name: ILike(`%${query.search}%`),
					is_deleted: false,
				},
			];
		}
		let { data: categories } = await this.businessService.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: {},
			order: { created_at: "DESC" },
		});
		// categories = this.businessService.filterCategoryByLang(categories, lang);
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: categories, message };
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
