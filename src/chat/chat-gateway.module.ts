import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { MessagesService } from "../api/messages/messages.service"; // O'zingizning xizmatingizga mos ravishda o'zgartiring
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesModule } from "../api/messages/messages.module";

@Module({
	imports: [MessagesModule],
	providers: [ChatGateway],
	exports:[ChatGateway] // Gateway va kerakli xizmatlarni ro'yxatdan o'tkazing
})
export class ChatGatewayModule {}
