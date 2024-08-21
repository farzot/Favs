import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { BaseService } from "../../infrastructure/lib/baseService";
import { NotificationEntity } from "../../core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationRepository } from "../../core/repository";

@Injectable()
export class NotificationsService extends BaseService<
	CreateNotificationDto,
	UpdateNotificationDto,
	NotificationEntity
> {
	constructor(@InjectRepository(NotificationEntity) repository: NotificationRepository) {
		super(repository, "Notification");
	}
}
