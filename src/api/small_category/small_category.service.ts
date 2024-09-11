import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateSmallCategoryDto } from "./dto/create-category.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { SmallCategoryEntity } from "src/core/entity/small-category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { FilterDto } from "src/common/dto/filter.dto";
import { FindOptionsWhereProperty, ILike } from "typeorm";
import { IResponse } from "src/common/type";
import { ProductService } from "../product/product.service";
import { UpdateSmallCategoryDto } from "./dto/update-category.dto";
import { SmallCategoryRepository } from "../../core/repository";
import { ExecuterEntity } from "../../core/entity/executer.entity";
import { BigCategoryService } from "../big_category/big_category.service";
import { BigCategoryEntity, BusinessEntity } from "../../core/entity";
import { ClientBusinessService } from "../business/service/client-business.service";

@Injectable()
export class SmallCategoryService extends BaseService<
	CreateSmallCategoryDto,
	UpdateSmallCategoryDto,
	SmallCategoryEntity
> {
	constructor(
		@InjectRepository(SmallCategoryEntity)
		private readonly categoryRepo: SmallCategoryRepository,
		@Inject(forwardRef(() => ProductService))
		private readonly productService: ProductService,
	) {
		super(categoryRepo, "Category");
	}

	/** get all categories */
	public async getAllCategories(
		query: FilterDto,
		lang: string,
	): Promise<IResponse<SmallCategoryEntity[]>> {
		let where_condition: FindOptionsWhereProperty<SmallCategoryEntity> = {
			is_deleted: false,
		};

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
		let { data: categories } = await this.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: {},
			order: { created_at: "DESC" },
		});
		categories = this.filterCategoryByLang(categories, lang);
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: categories, message };
	}

	

	public filterCategoryByLang(dto: SmallCategoryEntity[], lang: string) {
		return dto.map((item) => {
			if (lang == "uz") {
				return { ...item, name: item.name_uz };
			} else if (lang == "ru") {
				return { ...item, name: item.name_ru };
			} else if (lang == "en") {
				return { ...item, name: item.name_en };
			} else {
				return { ...item, name: item.name_en };
			}
		});
	}
}
