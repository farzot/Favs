import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller"; 
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "../../core/entity";
import { ChatGateway } from "../../chat/chat.gateway";
import { ChatGatewayModule } from "../../chat/chat-gateway.module";

@Module({
	imports: [TypeOrmModule.forFeature([NotificationEntity]), ChatGatewayModule],
	controllers: [NotificationsController],
	providers: [NotificationsService],
	exports: [NotificationsService],
})
export class NotificationsModule {}
