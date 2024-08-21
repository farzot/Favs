import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { BusinessPhotosService } from "./business_photos.service";
import { CreateBusinessPhotoDto } from "./dto/create-business_photo.dto";
import { UpdateBusinessPhotoDto } from "./dto/update-business_photo.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";

@Controller("business-photos")
export class BusinessPhotosController {
	constructor(private readonly businessPhotosService: BusinessPhotosService) {}

	@Post()
	create(@Body() dto: CreateBusinessPhotoDto, @CurrentLanguage() lang: string) {
		return this.businessPhotosService.create(dto, lang);
	}

	@Get()
	async findAll(@CurrentLanguage() lang: string) {
		await this.businessPhotosService.findAll(lang, {
			where: { is_deleted: false },
		});
	}

	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.businessPhotosService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateBusinessPhotoDto,
		@CurrentLanguage() lang: string,
	) {
		await this.businessPhotosService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.businessPhotosService.update(id, dto, lang);
	}

	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.businessPhotosService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.businessPhotosService.delete(id, lang);
	}
}
