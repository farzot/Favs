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
import { AdminBusinessService } from "../service/admin-business.service";
import { CreateBusinessDto, CreateBusinessTelegramChatIdDto, CreateTelegramChatIdDto, CreateTelegramChatTopicIdDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { AddBusinessRequestDto } from "../dto/add-business-request.dto";
import { CurrentLanguage } from "../../../common/decorator/current-language";
import { ICurrentExecuter } from "../../../common/interface/current-executer.interface";
import { FilterDto } from "../../../common/dto/filter.dto";
import { IResponse } from "../../../common/type";
import { BusinessEntity, ReservationEntity } from "../../../core/entity";
import { FindOptionsWhereProperty, ILike } from "typeorm";
import { responseByLang } from "../../../infrastructure/lib/prompts/successResponsePrompt";
import { JwtAuthGuard } from "../../auth/user/AuthGuard";
import { RolesGuard } from "../../auth/roles/RoleGuard";
import { RolesDecorator } from "../../auth/roles/RolesDecorator";
import { Roles } from "../../../common/database/Enums";
import { CurrentExecuter } from "../../../common/decorator/current-user";
import { ReservationsService } from "../../reservations/reservations.service";
import { SearchReservationByAdminDto } from "../../reservations/dto/sear-reservation.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("/admin/business")
export class AdminBusinessController {
	constructor(
		private readonly businessService: AdminBusinessService,
		private readonly reservationService: ReservationsService,
	) {}

	//create business
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	public async create(
		@Body() dto: CreateBusinessDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.createBusiness(dto, lang, executerPayload.executer);
	}

	// gett all business with filter
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/all")
	async findAll(
		@CurrentLanguage() lang: string,
		@Query() query: FilterDto,
	): Promise<IResponse<BusinessEntity[]>> {
		return await this.businessService.findAllBusiness(lang, query);
	}

	// get all reservations with filter
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/get-all-reservations")
	async findAllReservationsByFilter(
		@CurrentLanguage() lang: string,
		@Query() query: SearchReservationByAdminDto,
	): Promise<IResponse<ReservationEntity[]>> {
		return await this.reservationService.getAllReservationsForAdmin(query, lang);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post("/create/bus/chat_id")
	public async createTgChatIDBusiness(
		@Body() dto: CreateBusinessTelegramChatIdDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.createBusinessTgChatID(dto, executerPayload.executer, lang);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post("/create/chat_id")
	public async createTgChatID(
		@Body() dto: CreateTelegramChatIdDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.createTgChatID(dto, executerPayload.executer, lang);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post("/create/topic_id")
	public async createTgTopicID(
		@Body() dto: CreateTelegramChatTopicIdDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.createTgTopicID(dto, executerPayload.executer, lang);
	}

	// createTgChatIDBusiness{}
	// updateTgChatIDBusiness{}
	// getBusinessById{}
	// getBusinessCount{}
	// deleteBusiness{}
	// updateBusinessInfo{}
	// setBusinessRecommended{}
	// getUsersCount{}
}
