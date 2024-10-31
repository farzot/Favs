import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
	MessageBody,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageEntity } from "../core/entity";
import { MessagesService } from "../api/messages/messages.service";

@WebSocketGateway({
	cors: {
		origin: "*", // Sizning xosting serveringizni qo‘shing
	},
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server!: Server;

	constructor(
		// private readonly chatService: ChatService,
		private readonly messageService: MessagesService,
	) {}

	afterInit(server: Server) {
		console.log("WebSocket server initialized");
	}

	async handleConnection(client: Socket) {
		// Aloqa o‘rnatilganda
		console.log("Client connected:", client.id);
	}

	async handleDisconnect(client: Socket) {
		// Aloqa uzilganda
		console.log("Client disconnected:", client.id);
	}

	@SubscribeMessage("/sendMessage")
	async handleSendMessage(
		client: Socket,
		payload: { senderId: string; receiverId: string; content: string },
	) {
		const { senderId, receiverId, content } = payload;
		const message = await this.messageService.createMessage(senderId, receiverId, content);

		// Xabarni receiverId bilan bog‘langan barcha clientlarga yuborish
		this.server.to(receiverId).emit("message", message);
	}

	@SubscribeMessage("joinChat")
	handleJoinChat(client: Socket, userId: string) {
		client.join(userId); // Foydalanuvchini o‘zining ID bilan bog‘liq "xona"ga qo‘shadi
		console.log(`User ${userId} joined room ${userId}`);
	}

	@SubscribeMessage("newNotification")
	handleNotification(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
		this.server.emit("notification", data); // Barcha foydalanuvchilarga xabar jo'natadi
	}

	// Foydalanuvchiga xabar jo'natish uchun method
	async sendNotificationToUser(userId: string, title: string, message: string) {
		// Bu yerda foydalanuvchi socket connection ni boshqarish uchun userId dan foydalaniladi
		const payload = {
			title,
			message,
		};
		console.log("sendNotificationToUser ichidagi payload: ", payload);
		// Foydalanuvchiga notificationni jo'natish
		this.server.to(userId).emit("notification", payload);
	}
}
