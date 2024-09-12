import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessageEntity } from "../../core/entity";
import { BaseService } from "../../infrastructure/lib/baseService";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageRepository } from "../../core/repository";

@Injectable()
export class MessagesService extends BaseService<
	CreateMessageDto,
	UpdateMessageDto,
	MessageEntity
> {
	constructor(@InjectRepository(MessageEntity) repository: MessageRepository) {
		super(repository, "Message");
	}

	// async saveMessage(senderId: string, receiverId: string, content: string): Promise<MessageEntity> {
	// 	const message = this.getRepository.create({ senderId, receiverId, content });
	// 	return this.getRepository.save(message);
	// }

	// // Foydalanuvchilar o'rtasidagi xabarlarni olish
	// async getMessages(senderId: string, receiverId: string): Promise<MessageEntity[]> {
	// 	return this.getRepository.find({
	// 		where: [
	// 			{ senderId, receiverId },
	// 			{ senderId: receiverId, receiverId: senderId },
	// 		],
	// 		order: { createdAt: "ASC" },
	// 	});
	// }

	async createMessage(
		senderId: string,
		receiverId: string,
		content: string,
	): Promise<MessageEntity> {
		const message = this.getRepository.create({
			sender: { id: senderId },
			chat: { id: receiverId },
			content,
		});
		return this.getRepository.save(message);
	}

	async getMessages(senderId: string, receiverId: string): Promise<MessageEntity[]> {
		return this.getRepository.find({
			where: [
				{ sender: { id: senderId }, chat: { id: receiverId } },
				{ sender: { id: receiverId }, chat: { id: senderId } },
			],
			order: { createdAt: "ASC" },
			relations: ["sender", "chat"],
		});
	}

	async deleteMessage(messageId: string): Promise<void> {
		await this.getRepository.delete(messageId);
	}
}
