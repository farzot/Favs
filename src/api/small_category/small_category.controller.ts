import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { FilterDto } from "src/common/dto/filter.dto";
import { multerImageUpload } from "src/infrastructure/lib/fileService";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { SmallCategoryService } from "./small_category.service";
import { UpdateSmallCategoryDto } from "./dto/update-category.dto";
import { CreateSmallCategoryDto } from "./dto/create-category.dto";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { BigCategoryService } from "../big_category/big_category.service";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";

@Controller("/small-category")
export class SmallCategoryController {
	constructor(
		private readonly categoryService: SmallCategoryService,
		private readonly bigCategoryService: BigCategoryService,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	async createCategory(
		@Body() dto: CreateSmallCategoryDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.bigCategoryService.findOneById(dto.big_category.id, lang, {
			where: { is_deleted: false },
		});
		return this.categoryService.create(dto, lang, executerPayload.executer);
	}

	/** get all categories with filter */
	@Get("/all")
	async getAllCategories(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.categoryService.getAllCategories(query, lang);
	}

	/** get one category by id */
	@Get(":id")
	async getCategoryByID(@Param("id", ParseUUIDPipe) id: string, @CurrentLanguage() lang: string) {
		let { data: category } = await this.categoryService.findOneById(id, lang, {
			where: { is_deleted: false },
			// relations: { big_category: true },
		});
		[category] = this.categoryService.filterCategoryByLang([category], lang);
		const message = responseByLang("get_one", lang);
		return { status_code: 200, data: category, message };
	}

	/** get one category by big_category id */
	@Get("/by-big-category/:id")
	async getByBigCategoryID(
		@Param("id", ParseUUIDPipe) category_id: string,
		@CurrentLanguage() lang: string,
	) {
		let { data: category } = await this.categoryService.findOneBy(lang, {
			where: { is_deleted: false, big_category: { id: category_id } },
			// relations: { big_category: true },
		});
		[category] = this.categoryService.filterCategoryByLang([category], lang);
		const message = responseByLang("get_one", lang);
		return { status_code: 200, data: category, message };
	}

	//update small-category
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	async updateCategory(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateSmallCategoryDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.categoryService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		return this.categoryService.update(id, dto, lang, executerPayload.executer);
	}

	//delete small-category
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Delete(":id")
	async deleteCategory(
		@Param("id", ParseUUIDPipe) id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.categoryService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.categoryService.delete(id, lang, executerPayload.executer);
	}
}
