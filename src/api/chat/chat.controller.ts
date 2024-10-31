// import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
// import { ChatService } from "./chat.service";
// import { CreateChatDto } from "./dto/create-chat.dto";
// import { UpdateChatDto } from "./dto/update-chat.dto";
// import { CurrentLanguage } from "../../common/decorator/current-language";

// @Controller("chat")
// export class ChatController {
// 	constructor(private readonly chatService: ChatService) {}

// 	@Post()
// 	create(@Body() dto: CreateChatDto, @CurrentLanguage() lang: string) {
// 		return this.chatService.create(dto, lang);
// 	}

// 	@Get()
// 	async findAll(@CurrentLanguage() lang: string) {
// 		await this.chatService.findAll(lang, {
// 			where: { is_deleted: false },
// 		});
// 	}

// 	@Get(":id")
// 	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
// 		await this.chatService.findOneById(id, lang, {
// 			where: { is_deleted: false },
// 		});
// 	}

// 	@Patch(":id")
// 	async update(
// 		@Param("id") id: string,
// 		@Body() dto: UpdateChatDto,
// 		@CurrentLanguage() lang: string,
// 	) {
// 		await this.chatService.findOneById(id, lang, { where: { is_deleted: false } });
// 		return this.chatService.update(id, dto, lang);
// 	}

// 	@Delete(":id")
// 	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
// 		await this.chatService.findOneById(id, lang, { where: { is_deleted: false } });
// 		return this.chatService.delete(id, lang);
// 	}
// }
