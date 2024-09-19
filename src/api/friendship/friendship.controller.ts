import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { FriendshipService } from "./friendship.service";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";

@Controller("/friendship")
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	// Do'stlik so'rovini yuborish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/request/:addresseeId")
	async sendFriendRequest(
		@Param("addresseeId") addresseeId: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.friendshipService.sendFriendRequest(
			executerPayload.executer.id,
			addresseeId,
			lang,
		);
	}

	// Do'stlik so'rovini tasdiqlash
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Patch("/accept/:requesterId")
	async acceptFriendRequest(
		@Param("requesterId") requesterId: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.friendshipService.acceptFriendRequest(
			requesterId,
			executerPayload.executer.id,
			lang,
		);
	}

	// Do'stlar ro'yxatini olish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/friends")
	async getFriendsList(
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.friendshipService.getFriendsList(executerPayload.executer.id, lang);
	}

	// Do'stlikni bekor qilish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete("/remove/:friendId")
	async removeFriend(
		@Param("friendId") friendId: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.friendshipService.removeFriend(executerPayload.executer.id, friendId, lang);
	}
}
