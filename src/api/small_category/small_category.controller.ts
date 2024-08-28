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

@Controller("/admin/small-category")
export class SmallCategoryController {
	constructor(private readonly categoryService: SmallCategoryService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	async createCategory(
		@Body() dto: CreateSmallCategoryDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.categoryService.createCategory(dto, lang, executerPayload.executer);
	}

	@Get()
	async getAllCategories(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.categoryService.getAllCategories(query, lang);
	}

	@Get(":id")
	async getCategoryByID(@Param("id", ParseUUIDPipe) id: string, @CurrentLanguage() lang: string) {
		return this.categoryService.getCategoryByID(id, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	async updateCategory(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateSmallCategoryDto,
		@CurrentLanguage() lang: string = "ru",
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.categoryService.updateCategory(id, dto, lang, executerPayload.executer);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Delete(":id")
	async deleteCategory(
		@Param("id", ParseUUIDPipe) id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.categoryService.deleteCategory(id, lang, executerPayload.executer);
	}
}
