import { forwardRef, Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity, MessageEntity, UserEntity } from "../../core/entity";
import { UserModule } from "../user/user.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([ChatEntity, MessageEntity,UserEntity]),
		forwardRef(() => UserModule),
	],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})
export class ChatModule {}
