import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageEntity } from "../core/entity";
import { ChatService } from "../api/chat/chat.service";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server!: Server;

	constructor(private readonly chatService: ChatService) {}

	// WebSocket server init log
	afterInit(server: Server) {
		console.log("WebSocket Server Initialized");
	}

	// Client ulandi
	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	// Client uzildi
	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	// Xabar yuborish
	@SubscribeMessage("sendMessage")
	async handleMessage(
		client: Socket,
		payload: { chat_id: string; sender_id: string; content: string },
	) {
		const { chat_id, sender_id, content } = payload;
		const message: MessageEntity = await this.chatService.sendMessage(
			chat_id,
			sender_id,
			content,
		);

		// Chatdagi barcha userlarga xabarni yuborish
		this.server.to(`chat_${chat_id}`).emit("receiveMessage", message);
	}

	// Chatga qo'shilish
	@SubscribeMessage("joinChat")
	handleJoinChat(client: Socket, payload: { chatId: string }) {
		const { chatId } = payload;
		client.join(`chat_${chatId}`);
		console.log(`Client joined chat ${chatId}`);
	}

	// Chatni tark etish
	@SubscribeMessage("leaveChat")
	handleLeaveChat(client: Socket, payload: { chatId: string }) {
		const { chatId } = payload;
		client.leave(`chat_${chatId}`);
		console.log(`Client left chat ${chatId}`);
	}
}
