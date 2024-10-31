import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { ChatGateway } from "../../chat/chat.gateway";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "../../common/database/Enums";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("/notification")
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	public async createNotificationForOneUser(
		@Body() dto: CreateNotificationDto,
		@CurrentLanguage() lang: string,
	) {
		return this.notificationsService.createNotificationForOneUser(dto, lang);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/all")
	async findAll(@CurrentLanguage() lang: string) {
		await this.notificationsService.findAll(lang, {
			where: { is_deleted: false },
		});
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.notificationsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateNotificationDto,
		@CurrentLanguage() lang: string,
	) {
		await this.notificationsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.notificationsService.update(id, dto, lang);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.notificationsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.notificationsService.delete(id, lang);
	}
}
