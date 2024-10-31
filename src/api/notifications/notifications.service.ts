import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { BaseService } from "../../infrastructure/lib/baseService";
import { NotificationEntity } from "../../core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationRepository } from "../../core/repository";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { ChatGateway } from "../../chat/chat.gateway";

@Injectable()
export class NotificationsService extends BaseService<
	CreateNotificationDto,
	UpdateNotificationDto,
	NotificationEntity
> {
	constructor(
		@InjectRepository(NotificationEntity) repository: NotificationRepository,
		private readonly notificationsGateway: ChatGateway,
	) {
		super(repository, "Notification");
	}

	public async createNotificationForOneUser(
		dto: CreateNotificationDto,
		@CurrentLanguage() lang: string,
	) {
		const new_notification = this.create(dto, lang);
		await this.notificationsGateway.sendNotificationToUser(dto.user, dto.title, dto.message);
		return new_notification;
	}
}
