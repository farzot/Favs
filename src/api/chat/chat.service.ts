// import { forwardRef, Inject, Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { BaseService } from "../../infrastructure/lib/baseService";
// import { CreateChatDto } from "./dto/create-chat.dto";
// import { UpdateChatDto } from "./dto/update-chat.dto";
// import { ChatEntity, MessageEntity, ExecuterEntity } from "../../core/entity";
// import { UserService } from "../user/user.service";
// import { ChatRepository, MessageRepository, UserRepository } from "../../core/repository";

// @Injectable()
// export class ChatService extends BaseService<CreateChatDto, UpdateChatDto, ChatEntity> {
// 	constructor(
// 		@InjectRepository(ChatEntity)
// 		private readonly chatRepository: ChatRepository,
// 		@InjectRepository(MessageEntity)
// 		private readonly messageRepo: MessageRepository,
// 		@InjectRepository(ExecuterEntity)
// 		private readonly userRepository: UserRepository,
// 		@Inject(forwardRef(() => UserService))
// 		private userService: UserService,
// 	) {
// 		super(chatRepository, "Chat");
// 	}

// 	// Yangi xabar yuborish
// 	// async sendMessage(chat_id: string, sender_id: string, content: string): Promise<MessageEntity> {
// 	// 	const chat = await this.chatRepo.findOne({
// 	// 		where: { id: chat_id },
// 	// 		relations: ["participants"],
// 	// 	});
// 	// 	const sender = await this.userRepo.findOne({ where: { id: sender_id, is_deleted: false } });

// 	// 	if (!chat || !sender) {
// 	// 		throw new Error("Chat or Sender not found");
// 	// 	}

// 	// 	if (!chat.participants.some((p) => p.id === sender.id)) {
// 	// 		throw new Error("Sender is not part of this chat");
// 	// 	}

// 	// 	const message = this.messageRepo.create({ chat, sender, content });
// 	// 	return await this.messageRepo.save(message);
// 	// }

// 	async createChat(userIds: string[], isGroup: boolean, lang: string): Promise<ChatEntity> {
// 		const participants = await this.userRepository.findByIds(userIds);
// 		const chat = this.chatRepository.create({ participants });
// 		return this.chatRepository.save(chat);
// 	}

// 	async getChatById(chatId: string): Promise<ChatEntity | null> {
// 		return await this.chatRepository.findOne({
// 			where: { id: chatId },
// 			relations: ["participants", "messages"],
// 		});
// 	}

// 	async getUserChats(userId: string): Promise<ChatEntity[]> {
// 		return this.chatRepository
// 			.createQueryBuilder("chat")
// 			.innerJoin("chat.participants", "user")
// 			.where("user.id = :userId", { userId })
// 			.getMany();
// 	}
// }
