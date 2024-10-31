import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "../../common/database/Enums";
import { CancelReservationDto } from "./dto/cancel-reservation.dto";
import { CancelConfirmedReservationDto } from "./dto/cancel-confirmed-reservation.dto";
import { SearchReservationDto } from "./dto/sear-reservation.dto";

@Controller("/reservations")
export class ReservationsController {
	constructor(private readonly reservationsService: ReservationsService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/create/reservation-request")
	public async createReservationByClient(
		@Body() dot: CreateReservationDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.reservationsService.createReservationByClient(
			dot,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_OWNER)
	@Post("/confirm-reservation")
	public async confirmReservationByAdmin(
		@Body("reservation_id") reservation_id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.reservationsService.confirmReservationByAdmin(
			reservation_id,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Post("/reject-reservation")
	public async rejectReservationByAdmin(
		@Body() dto: CancelReservationDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.reservationsService.rejectReservationByAdmin(
			dto,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/cancel-reservation-by-user")
	public async cancelConfirmedReservationByClient(
		@Body() dto: CancelConfirmedReservationDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.reservationsService.cancelConfirmedReservationByClient(
			dto,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Get("/all-reservations")
	public async getAllReservationsByBusinessAdmin(
		@Query() queryParams: SearchReservationDto,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.reservationsService.getAllReservationsByBusinessAdmin(
			queryParams,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/self-reservations")
	public async getAllSelfReservations(
		@Query() queryParams: SearchReservationDto,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.reservationsService.getAllSelfReservations(
			queryParams,
			executerPayload.executer,
			lang,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Patch("/block-by-admin")
	public async blockReservation(
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return await this.reservationsService.blockReservation(executerPayload.executer, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Patch("/unblock-by-admin")
	public async unblockReservation(
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return await this.reservationsService.unblockReservation(executerPayload.executer, lang);
	}
}
