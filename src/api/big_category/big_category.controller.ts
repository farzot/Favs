import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
} from "@nestjs/common";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { BigCategoryService } from "./big_category.service";
import { CreateBigCategoryDto } from "./dto/create-big_category.dto";
import { UpdateBigCategoryDto } from "./dto/update-big_category.dto";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "../../common/database/Enums";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { FindOptionsWhereProperty, ILike } from "typeorm";
import { BigCategoryEntity } from "../../core/entity";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { FilterDto } from "../../common/dto/filter.dto";
import { IResponse } from "../../common/type";

@Controller("/big-category")
export class BigCategoryController {
	constructor(private readonly bigCategoryService: BigCategoryService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	async create(
		@Body() dto: CreateBigCategoryDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.bigCategoryService.create(dto, lang, executerPayload.executer);
	}

	@Get("/all")
	async findAll(
		@CurrentLanguage() lang: string,
		@Query() query: FilterDto,
	): Promise<IResponse<BigCategoryEntity[]>> {
		let where_condition: FindOptionsWhereProperty<BigCategoryEntity> = {};
			if (query?.search) {
				where_condition = [
					{
						name_uz: ILike(`%${query.search}%`),
						is_deleted: false,
					},
					{
						name_ru: ILike(`%${query.search}%`),
						is_deleted: false,
					},
					{
						name_en: ILike(`%${query.search}%`),
						is_deleted: false,
					},
				];
			}
		let { data: categories } = await this.bigCategoryService.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: {},
			order: { created_at: "DESC" },
		});
		categories = this.bigCategoryService.filterCategoryByLang(categories, lang);
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: categories, message };
	}

	@Get(":id")
	async findOne(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
	): Promise<IResponse<BigCategoryEntity>> {
		let { data: category } = await this.bigCategoryService.findOneById(id, lang, {
			where: { is_deleted: false },
			relations: { small_categories: true },
		});
		[category] = this.bigCategoryService.filterCategoryByLang([category], lang);
		const message = responseByLang("get_one", lang);
		return { status_code: 200, data: category, message };
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateBigCategoryDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.bigCategoryService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.bigCategoryService.update(id, dto, lang, executerPayload.executer);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Delete(":id")
	async remove(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.bigCategoryService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.bigCategoryService.delete(id, lang, executerPayload.executer);
	}
}
