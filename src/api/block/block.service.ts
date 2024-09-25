import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlockRepository, ExecuterRepository } from "../../core/repository";
import { UserNotFound } from "../auth/exception";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { BaseService } from "../../infrastructure/lib/baseService";
import { CreateBlockDto } from "./dto/create-block.dto";
import { UpdateBlockDto } from "./dto/update-block.dto";
import { BlockEntity, ExecuterEntity } from "../../core/entity";

@Injectable()
export class BlockService extends BaseService<CreateBlockDto,UpdateBlockDto,BlockEntity>{
	constructor(
		@InjectRepository(BlockEntity) repository: BlockRepository,
		@InjectRepository(ExecuterEntity)
		private executerRepository: ExecuterRepository,
	) {
		super(repository, "block");
	}

	// Userni bloklash
	async blockUser(blockerId: string, blockedId: string, lang: string) {
		const blocker = await this.executerRepository.findOneBy({ id: blockerId });
		const blocked = await this.executerRepository.findOneBy({ id: blockedId });

		if (!blocked) {
			throw new UserNotFound();
		}

		const block = this.getRepository.create({
			blocker,
			blocked,
			is_active: true,
		});

		const created_data = await this.getRepository.save(block);
		const message = responseByLang("success", lang);

		return {
			status_code: 201,
			message,
			data: [],
		};
	}

	// Blokni olib tashlash
	async unblockUser(blockerId: string, blockedId: string, lang: string) {
		const block = await this.getRepository.findOne({
			where: { blocker: { id: blockerId }, blocked: { id: blockedId }, is_active: true },
		});

		if (!block) {
			throw new UserNotFound();
		}

		block.is_active = false;
		const updated_data = await this.getRepository.save(block);

		const message = responseByLang("unblock", lang);
		return {
			status_code: 200,
			message,
			data: updated_data,
		};
	}

	// Bloklangan foydalanuvchilar ro'yxatini olish
	async getBlockedUsers(executerId: string, lang: string) {
		const blockedUsers = await this.getRepository.find({
			where: { blocker: { id: executerId }, is_active: true },
			relations: ["blocked"],
			order: { created_at: "DESC" },
		});

		const message = responseByLang("get_all", lang);
		return {
			status_code: 200,
			message,
			data: blockedUsers.map((block) => block.blocked),
		};
	}
}
