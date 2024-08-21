import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { BigCategoryService } from "./big_category.service";
import { CreateBigCategoryDto } from "./dto/create-big_category.dto";
import { UpdateBigCategoryDto } from "./dto/update-big_category.dto";

@Controller("big-category")
export class BigCategoryController {
	constructor(private readonly bigCategoryService: BigCategoryService) {}

	@Post()
	create(@Body() dto: CreateBigCategoryDto, @CurrentLanguage() lang: string) {
		return this.bigCategoryService.create(dto, lang);
	}

	@Get()
	async findAll(@CurrentLanguage() lang: string) {
		await this.bigCategoryService.findAll(lang, {
			where: { is_deleted: false },
		});
	}

	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.bigCategoryService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateBigCategoryDto,
		@CurrentLanguage() lang: string,
	) {
		await this.bigCategoryService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.bigCategoryService.update(id, dto, lang);
	}

	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.bigCategoryService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.bigCategoryService.delete(id, lang);
	}
}
