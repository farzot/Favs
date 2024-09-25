import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CurrentLanguage } from '../../common/decorator/current-language';

@Controller("/notification")
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Post()
	create(@Body() dto: CreateNotificationDto, @CurrentLanguage() lang: string) {
		return this.notificationsService.create(dto, lang);
	}

	@Get("/all")
	async findAll(@CurrentLanguage() lang: string) {
		await this.notificationsService.findAll(lang, {
			where: { is_deleted: false },
		});
	}

	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.notificationsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateNotificationDto,
		@CurrentLanguage() lang: string,
	) {
		await this.notificationsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.notificationsService.update(id, dto, lang);
	}

	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.notificationsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.notificationsService.delete(id, lang);
	}
}
