import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([MessageEntity])],
	controllers: [MessagesController],
	providers: [MessagesService],
	exports: [MessagesService],
})
export class MessagesModule {}
