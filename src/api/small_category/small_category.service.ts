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

@Injectable()
export class SmallCategoryService extends BaseService<
	CreateSmallCategoryDto,
	UpdateSmallCategoryDto,
	SmallCategoryEntity
> {
	constructor(
		@InjectRepository(SmallCategoryEntity) private readonly categoryRepo: SmallCategoryRepository,
		@Inject(forwardRef(() => ProductService))
		private readonly productService: ProductService,
	) {
		super(categoryRepo, "Category");
	}

	async createCategory(dto: CreateSmallCategoryDto, lang: string) {
		const new_category = new SmallCategoryEntity();
		new_category.name_uz = dto.name_uz;
		new_category.name_ru = dto.name_ru;
		new_category.name_en = dto.name_en;
		const data = await this.categoryRepo.save(new_category);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			message,
			data,
		};
	}

	async updateCategory(id: string, dto: UpdateSmallCategoryDto, lang: string = "ru") {
		const { data } = await this.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		if (data) {
			await this.categoryRepo.update(id, {
				...dto,
				updated_at: Date.now(),
			});
		}
		const message = responseByLang("update", lang);
		return {
			status_code: 200,
			message,
			data: [],
		};
	}

	async deleteCategory(id: string, lang: string) {
		const { data: category } = await this.findOneById(id, lang, {
			relations: { products: true },
		});
		if (category) {
			await this.delete(id, lang);
			for (let product of category?.products) {
				await this.productService.getRepository.update(product.id, {
					is_deleted: true,
					is_active: false,
				});
			}
		}
		const message = responseByLang("delete", lang);
		return { status_code: 200, message, data: [] };
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
		let categories = await this.categoryRepo
			.createQueryBuilder("category")
			.leftJoinAndSelect(
				"category.products",
				"product",
				"product.is_deleted = :productIsDeleted",
				{ productIsDeleted: false },
			)
			.where(where_condition)
			.orderBy("category.id", "DESC")
			.getMany();

		categories = categories.map((item:any) => {
			item.products = this.productService.filterProductByLang(item.products, lang);
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

		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: categories, message };
	}

	/** get one category by id */
	public async getCategoryByID(id: string, lang: string) {
		const { data: _category } = await this.findOneById(id, lang, {
			where: { is_deleted: false },
			relations: { products: true },
		});

		if (!_category) {
			const message = responseByLang("not_found", lang);
			return { status_code: 404, data: null, message };
		}

		_category.products = this.productService.filterProductByLang(_category.products, lang);
		let category;
		if (lang == "uz") {
			category = { ..._category, name: _category.name_uz };
		} else if (lang == "ru") {
			category = { ..._category, name: _category.name_ru };
		} else if (lang == "en") {
			category = { ..._category, name: _category.name_en };
		} else {
			category = { ..._category, name: _category.name_en };
		}

		const message = responseByLang("get_one", lang);
		return { status_code: 200, data: category, message };
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
