import { Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { ReservationEntity } from "../../core/entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsModule } from "../notifications/notifications.module";
import { MailService } from "../mail/mail.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ReservationEntity,
			// TelegramChatIDEntity,
			// TelegramTopicIDEntity,
			// NotificationEntity,
		]),
		NotificationsModule,
	],
	controllers: [ReservationsController],
	providers: [ReservationsService, MailService],
	exports: [ReservationsService],
})
export class ReservationsModule {}
