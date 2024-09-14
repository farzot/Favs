import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { InjectRepository } from "@nestjs/typeorm";
import { CollectionsEntity } from "../../core/entity";
import { CollectionsRepository } from "../../core/repository";
import { AlreadyExistsError } from "./exception/already-exists.exception";

@Controller("/collections")
export class CollectionsController {
	constructor(
		private readonly collectionsService: CollectionsService,
		@InjectRepository(CollectionsEntity) private readonly repository: CollectionsRepository,
	) {}

	//create collection
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	public async create(
		@Body() dto: CreateCollectionDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const user = executerPayload.executer;
		const existing_collection = await this.repository.findOneBy({
			is_deleted: false,
			business: { id: dto.business.id },
			user: executerPayload.executer,
		});
		if (existing_collection) {
			throw new AlreadyExistsError();
		}
		const new_dto = { ...dto, user };
		return this.collectionsService.create(new_dto, lang);
	}

	// get all self-collections
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-all-self-collections")
	async findAll(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		// return await this.collectionsService.findAll(lang, {
		// 	where: { is_deleted: false, user: executerPayload.executer },
		// });
		let collections = await this.repository.findBy({
			is_deleted: false,
			user: executerPayload.executer,
		});
		if (!collections) {
			collections = [];
		}
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: collections, message };
	}

	// get all with filtered by category
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-all-self-filter")
	async findAllFilterByCategory(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter, // hozirgi ijrochi
	) {
		// Barcha collectionsni olish
		const collections = await this.repository
			.createQueryBuilder("collection")
			.leftJoinAndSelect("collection.business", "business")
			.leftJoinAndSelect("business.categories", "category")
			.where("collection.user.id = :userId", { userId: executerPayload.executer.id })
			.andWhere("collection.is_deleted = false") // Agar kerak bo'lsa
			.getMany();

		// Kategoriyalar bo'yicha ajratish
		const categoryMap = new Map<
			string,
			{ public: CollectionsEntity[]; private: CollectionsEntity[] }
		>();

		for (const collection of collections) {
			const business = collection.business;
			if (business) {
				const categories = business.categories;
				for (const category of categories) {
					const categoryId = category.id;
					if (!categoryMap.has(categoryId)) {
						categoryMap.set(categoryId, { public: [], private: [] });
					}

					if (collection.is_private) {
						categoryMap.get(categoryId)?.private.push(collection);
					} else {
						categoryMap.get(categoryId)?.public.push(collection);
					}
				}
			}
		}

		// Tilga qarab xabar tayyorlash
		const message = responseByLang("get_all", lang);

		// Natijani qaytarish
		return {
			status_code: 200,
			message,
			data: Array.from(categoryMap.entries()).map(([categoryId, collections]) => ({
				categoryId,
				public: collections.public,
				private: collections.private,
			})),
		};
	}

	// get self-collection by id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get(":id")
	async findOne(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.collectionsService.findOneById(id, lang, {
			where: { is_deleted: false, user: executerPayload.executer },
		});
	}

	// update self-collection by id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateCollectionDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.collectionsService.findOneById(id, lang, {
			where: { is_deleted: false, user: executerPayload.executer },
		});
		return this.collectionsService.update(id, dto, lang);
	}

	// delete self-collection by id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete(":id")
	async remove(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.collectionsService.findOneById(id, lang, {
			where: { is_deleted: false, user: executerPayload.executer },
		});
		return this.collectionsService.delete(id, lang);
	}
}
