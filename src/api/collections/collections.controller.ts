import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";

@Controller("collections")
export class CollectionsController {
	constructor(private readonly collectionsService: CollectionsService) {}

	@Post()
	create(@Body() dto: CreateCollectionDto, @CurrentLanguage() lang: string) {
		return this.collectionsService.create(dto, lang);
	}

	@Get()
	async findAll(@CurrentLanguage() lang: string) {
		await this.collectionsService.findAll(lang, {
			where: { is_deleted: false },
		});
	}

	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.collectionsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateCollectionDto,
		@CurrentLanguage() lang: string,
	) {
		await this.collectionsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.collectionsService.update(id, dto, lang);
	}

	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.collectionsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.collectionsService.delete(id, lang);
	}
}
