import { Injectable } from "@nestjs/common";
import { CreateFriendshipDto } from "./dto/create-friendship.dto";
import { UpdateFriendshipDto } from "./dto/update-friendship.dto";
import { FriendshipEntity } from "../../core/entity/friendship.entity";
import { FriendshipRepository } from "../../core/repository/friendship.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../infrastructure/lib/baseService";
import { ExecuterRepository } from "../../core/repository";
import { ExecuterEntity } from "../../core/entity";
import { UserService } from "../user/user.service";
import { UserNotFound } from "../auth/exception";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";

@Injectable()
export class FriendshipService extends BaseService<
	CreateFriendshipDto,
	UpdateFriendshipDto,
	FriendshipEntity
> {
	constructor(
		@InjectRepository(FriendshipEntity) repository: FriendshipRepository,
		@InjectRepository(ExecuterEntity)
		private executerRepository: ExecuterRepository,
		private readonly userService: UserService,
	) {
		super(repository, "friendship");
	}

	// Do'stlik so'rovini yuborish
	async sendFriendRequest(requesterId: string, addresseeId: string, lang: string) {
		const requester = await this.executerRepository.findOneBy({ id: requesterId });
		const addressee = await this.executerRepository.findOneBy({ id: addresseeId });

		if (!addressee) {
			throw new UserNotFound();
		}

		const friendship = this.getRepository.create({
			requester,
			addressee,
			is_accepted: false,
		});

		const created_data = this.getRepository.save(friendship);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			message,
			data: created_data,
		};
	}

	// Do'stlik so'rovini tasdiqlash
	async acceptFriendRequest(requesterId: string, addresseeId: string, lang: string) {
		// const friendship = await this.getRepository.findOne({
		// 	where: { requester: { id: requesterId }, addressee: { id: addresseeId} },
		// });

		const { data: friendship } = await this.findOneBy(lang, {
			where: {
				requester: { id: requesterId },
				addressee: { id: addresseeId },
				is_deleted: false,
			},
		});

		friendship.is_accepted = true;
		const created_data = this.getRepository.save(friendship);

		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			message,
			data: created_data,
		};
	}

	// Do'stlar ro'yxatini olish
	async getFriendsList(executerId: string, lang: string) {
		const { data: friendships } = await this.findAll(lang, {
			where: [
				{ requester: { id: executerId }, is_accepted: true, is_deleted: false },
				{ addressee: { id: executerId }, is_accepted: true, is_deleted: false },
			],
			relations: ["requester", "addressee"],
			order: { created_at: "DESC" },
		});

		const friends = friendships.map((friendship) =>
			friendship.requester.id === executerId ? friendship.addressee : friendship.requester,
		);
		const message = responseByLang("get_all", lang);
		return {
			status_code: 200,
			data: friends,
			message,
		};
	}

	// Do'stlikni bekor qilish
	async removeFriend(executerId: string, friendId: string,lang:string) {
		await this.getRepository.delete({
			requester: { id: executerId },
			addressee: { id: friendId },
		});
		await this.getRepository.delete({
			requester: { id: friendId },
			addressee: { id: executerId },
		});

		const message = responseByLang("delete", lang);
		return {
			status_code: 200,
			data: [],
			message,
		};
	}
}
