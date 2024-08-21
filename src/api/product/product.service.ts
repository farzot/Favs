import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { ProductEntity } from "src/core/entity/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepository } from "src/core/repository/product.repository";
import { createFile, deleteFile } from "src/infrastructure/lib/fileService";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { ImageProductDto } from "./dto/image-product.dto";
import {
	FileRequiredException,
	MaxFileException,
} from "src/infrastructure/lib/fileService/exception/file.exception";
import { ProductQueryDto } from "./dto/query-product.dto";
import { FindOptionsWhere, FindOptionsWhereProperty, ILike } from "typeorm";
import { IResponse } from "src/common/type";
import { ImageNameNotFound } from "./exception/image-not-found";
import { DiscountPercentNotFound, DiscountPriceNotFound } from "./exception/discount";
import { SmallCategoryEntity } from "../../core/entity";
import { SmallCategoryService } from "../small_category/small_category.service";
import { SmallCategoryRepository } from "../../core/repository";

@Injectable()
export class ProductService extends BaseService<CreateProductDto, UpdateProductDto, ProductEntity> {
	constructor(
		@InjectRepository(ProductEntity) private readonly productRepo: ProductRepository,
		@InjectRepository(SmallCategoryEntity) private readonly categoryRepo: SmallCategoryRepository,
		@Inject(forwardRef(() => SmallCategoryService))
		private categoryService: SmallCategoryService,
	) {
		super(productRepo, "product");
	}

	async createProduct(dto: CreateProductDto, files: any, lang: string = "ru") {
		const new_product = new ProductEntity();
		if (!files.images) {
			throw new FileRequiredException();
		}
		let uploaded_files: string[] = [];
		files.images.map(async (image: any) => {
			const uploaded = await createFile(image);
			uploaded_files.push(uploaded);
		});
		const { data: category } = await this.categoryService.findOneById(dto.category, lang, {
			where: { is_deleted: false },
		});
		new_product.images = uploaded_files;
		new_product.name_uz = dto.name_uz;
		new_product.name_en = dto.name_en;
		new_product.name_ru = dto.name_ru;
		new_product.description_uz = dto.description_uz;
		new_product.description_en = dto.description_en;
		new_product.description_ru = dto.description_ru;
		new_product.amount = dto.amount;
		new_product.price = dto.price;
		new_product.type = dto.type;
		new_product.category = category;
		const data = await this.productRepo.save(new_product);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			message,
			data,
		};
	}

	async updateProduct(id: string, dto: UpdateProductDto, lang: string) {
		const { data: product } = await this.findOneById(id, lang, {
			relations: { category: true },
		});
		if (product) {
			let category = null;
			if (dto.category) {
				category = (
					await this.categoryService.findOneById(dto.category, lang, {
						where: { is_deleted: false },
					})
				).data;
			}
			if (dto.discount) {
				if (!dto.discount_percent) {
					throw new DiscountPercentNotFound();
				}
				if (!dto.discount_price) {
					throw new DiscountPriceNotFound();
				}
			}

			await this.productRepo.update(id, {
				...dto,
				category: category || product.category,
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

	async addImageToProduct(id: string, image: Express.Multer.File, lang: string) {
		if (!image) {
			throw new FileRequiredException();
		}
		const { data: product } = await this.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		let images = product.images;
		if (images.length >= 4) {
			throw new MaxFileException();
		}
		images.push(image.filename);
		await this.productRepo.update(id, {
			images: images || product.images,
			updated_at: Date.now(),
		});
		const message = responseByLang("update", lang);
		return {
			status_code: 200,
			message,
			data: [],
		};
	}

	async removeImageFromProduct(id: string, dto: ImageProductDto, lang: string) {
		const { data: product } = await this.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		let images = product.images;

		let imageFound = false;
		for (let i = 0; i < images.length; i++) {
			if (images[i] == dto.image_name) {
				images = images.slice(0, i).concat(images.slice(i + 1));
				imageFound = true;
				break;
			}
		}
		if (!imageFound) {
			throw new ImageNameNotFound();
		}
		await this.productRepo.update(id, {
			images: images || product.images,
			updated_at: Date.now(),
		});
		const message = responseByLang("update", lang);
		return {
			status_code: 200,
			message,
			data: [],
		};
	}

	async deleteProduct(id: string, lang: string) {
		const { data: product } = await this.findOneById(id, lang);
		if (product) {
			if (product.images) {
				product.images.map(async (image: any) => {
					await deleteFile(image);
				});
			}
			await this.delete(id, lang);
		}
		const message = responseByLang("delete", lang);
		return { status_code: 200, message, data: [] };
	}

	/** get all product */
	public async getAllProducts(
		lang: string,
		query: ProductQueryDto,
	): Promise<IResponse<ProductEntity[]>> {
		let where_condition: FindOptionsWhere<ProductEntity>[] | FindOptionsWhere<ProductEntity> = {
			is_deleted: false,
			category: { id: query?.category_id },
		};

		if (query.is_popular) {
			where_condition.is_popular = query.is_popular;
		}

		if (query.is_recomended) {
			where_condition.is_recomended = query.is_recomended;
		}

		if (query.type) {
			where_condition.type = query.type;
		}

		if (query?.search) {
			where_condition = [
				{
					name_uz: ILike(`%${query.search}%`),
					is_deleted: false,
					category: { id: query?.category_id },
					is_popular: query?.is_popular,
					is_recomended: query?.is_recomended,
					type: query?.type,
				},
				{
					description_uz: ILike(`%${query.search}%`),
					is_deleted: false,
					category: { id: query?.category_id },
					is_popular: query?.is_popular,
					is_recomended: query?.is_recomended,
					type: query?.type,
				},
				{
					name_ru: ILike(`%${query.search}%`),
					is_deleted: false,
					category: { id: query?.category_id },
					is_popular: query?.is_popular,
					is_recomended: query?.is_recomended,
					type: query?.type,
				},
				{
					description_ru: ILike(`%${query.search}%`),
					is_deleted: false,
					category: { id: query?.category_id },
					is_popular: query?.is_popular,
					is_recomended: query?.is_recomended,
					type: query?.type,
				},
				{
					name_en: ILike(`%${query.search}%`),
					is_deleted: false,
					category: { id: query?.category_id },
					is_popular: query?.is_popular,
					is_recomended: query?.is_recomended,
					type: query?.type,
				},
				{
					description_en: ILike(`%${query.search}%`),
					is_deleted: false,
					category: { id: query?.category_id },
					is_popular: query?.is_popular,
					is_recomended: query?.is_recomended,
					type: query?.type,
				},
			];
		}

		let products: any = {};
		if (query?.page && query?.page_size) {
			products = await this.findAllWithPagination(lang, {
				relations: { category: true, feedbacks: { user: true } },
				where: where_condition,
				take: query.page_size,
				skip: query.page,
			});
		} else {
			products = await this.findAll(lang, {
				relations: { category: true, feedbacks: { user: true } },
				where: where_condition,
			});
		}

		for (let item of products.data) {
			item.category = this.categoryService.filterCategoryByLang([item.category], lang)[0];
		}
		const filteredProducts = this.filterProductByLang(products.data, lang);
		products.data = filteredProducts;

		return products;
	}

	/** get one product */
	public async getProductByID(id: string, lang: string) {
		const _product = await this.findOneById(id, lang, {
			relations: { category: true, feedbacks: { user: true } },
			where: { is_deleted: false },
		});

		_product.data.category = this.categoryService.filterCategoryByLang(
			[_product.data.category],
			lang,
		)[0];
		const category = this.filterProductByLang([_product.data], lang)[0];

		const message = responseByLang("get_one", lang);
		return { status_code: 200, data: category, message };
	}

	public filterProductByLang(dto: ProductEntity[], lang: string) {
		return dto.map((item) => {
			if (lang == "uz") {
				return {
					...item,
					name: item.name_uz,
					description: item.description_uz,
				};
			} else if (lang == "ru") {
				return {
					...item,
					name: item.name_ru,
					description: item.description_ru,
				};
			} else if (lang == "en") {
				return {
					...item,
					name: item.name_en,
					description: item.description_en,
				};
			} else {
				return {
					...item,
					name: item.name_en,
					description: item.description_en,
				};
			}
		});
	}

	public async getAllCategorizedProducts(
		query: ProductQueryDto,
		lang: string,
	): Promise<IResponse<SmallCategoryEntity[]>> {
		let where_condition: FindOptionsWhereProperty<SmallCategoryEntity> = {
			is_deleted: false,
		};

		let categories = await this.categoryRepo
			.createQueryBuilder("category")
			.leftJoinAndSelect(
				"category.products",
				"product",
				`
                product.is_deleted = :productIsDeleted
                ${query.type ? "AND product.type = :type" : ""}
                ${
					query.search
						? `AND (
                        product.name_uz ILIKE :name
                        AND product.name_ru ILIKE :name
                        AND product.name_en ILIKE :name
                      )`
						: ""
				}
              `,
				{
					productIsDeleted: false,
					name: query.search ? `%${query.search}%` : undefined,
					type: query.type || undefined,
				},
			)
			.where(where_condition)
			.orderBy("category.id", "DESC")
			.getMany();

		categories = categories.map((item:any) => {
			item.products = this.filterProductByLang(item.products, lang);
			console.log(item, lang);

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
}
