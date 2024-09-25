import { Controller, Post, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { BlockService } from "./block.service";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";

@Controller("/block")
export class BlockController {
	constructor(private readonly blockService: BlockService) {}

	// Userni bloklash
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/:blockedId")
	public async blockUser(
		@Param("blockedId") blockedId: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.blockService.blockUser(executerPayload.executer.id, blockedId, lang);
	}

	// Userni blokdan chiqarish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/unblock/:blockedId")
	public async unblockUser(
		@Param("blockedId") blockedId: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.blockService.unblockUser(executerPayload.executer.id, blockedId, lang);
	}

	// Bloklangan foydalanuvchilar ro'yxatini olish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/blocked-users")
	public async getBlockedUsers(
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.blockService.getBlockedUsers(executerPayload.executer.id, lang);
	}
}
