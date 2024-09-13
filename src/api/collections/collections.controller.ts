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

@Controller("/collections")
export class CollectionsController {
	constructor(
		private readonly collectionsService: CollectionsService,
		@InjectRepository(CollectionsEntity) private readonly repository: CollectionsRepository,
	) {}

	//create collection
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	create(
		@Body() dto: CreateCollectionDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const user = executerPayload.executer;
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
			collections=[]
		}
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: collections, message };
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
