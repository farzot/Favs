// import { forwardRef, Module } from "@nestjs/common";
// import { ChatService } from "./chat.service";
// import { ChatController } from "./chat.controller";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { ChatEntity, MessageEntity, ExecuterEntity } from "../../core/entity";
// import { UserModule } from "../user/user.module";
// import { ChatGateway } from "../../chat/chat.gateway";
// import { MessagesService } from "../messages/messages.service";
// import { MessagesModule } from "../messages/messages.module";

// @Module({
// 	imports: [
// 		TypeOrmModule.forFeature([ChatEntity, MessageEntity, ExecuterEntity]),
// 		forwardRef(() => UserModule),
// 		MessagesModule
// 	],
// 	controllers: [ChatController],
// 	providers: [ChatService, ChatGateway, MessagesService],
// 	exports: [ChatService],
// })
// export class ChatModule {}
