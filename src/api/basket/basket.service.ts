import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity, ExecuterEntity } from "src/core/entity";
import { BasketRepository } from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { DataSource } from "typeorm";
import { ProductService } from "../product/product.service";
import { CreateBasketDto, CreateMultipleBasketDto } from "./dto/create-basket.dto";
import { UpdateBasketDto } from "./dto/update-basket.dto";
import { BasketAlreadyExists } from "./exception/basket-already-exists";
import { BasketNotFound } from "./exception/basket-not-found";
import { NotEnoughProduct } from "./exception/not-enough-product";
import { IResponse } from "src/common/type";

@Injectable()
export class BasketService extends BaseService<CreateBasketDto, UpdateBasketDto, BasketEntity> {
	constructor(
		@InjectRepository(BasketEntity) private readonly basketRepo: BasketRepository,
		private productService: ProductService,
		private readonly dataSource: DataSource,
	) {
		super(basketRepo, "Basket");
	}

	/** create basket by one by */
	public async createBasket(
		dto: CreateBasketDto,
		lang: string,
		user: ExecuterEntity,
	): Promise<IResponse<BasketEntity[]>> {
		const old_basket = await this.basketRepo.findOne({
			where: { user, product: { id: dto.product.id } },
		});

		if (old_basket) {
			throw new BasketAlreadyExists();
		}

		const { data: product } = await this.productService.findOneById(dto.product.id, lang, {
			where: { is_deleted: false },
		});

		if (product.amount < dto.amount) {
			throw new NotEnoughProduct();
		}

		await this.basketRepo.save(this.basketRepo.create({ ...dto, user }));

		const all_basket = await this.basketRepo.find({
			where: { user },
			relations: { product: true },
			order: { id: "DESC" },
		});

		const message = responseByLang("create", lang);
		return { status_code: 201, data: all_basket, message };
	}

	/** update basket infos */
	public async updateBasket(
		id: string,
		dto: UpdateBasketDto,
		lang: string,
		user: ExecuterEntity,
	): Promise<IResponse<BasketEntity[]>> {
		const { data: basket } = await this.findOneBy(lang, {
			where: { user, product: { id, is_deleted: false } },
			relations: { product: true },
		});

		if (basket.product.amount < dto.amount) {
			throw new NotEnoughProduct();
		} else if (dto.amount == 0) {
			await this.basketRepo.delete(basket.id);
		} else {
			basket.amount = dto.amount;
			await this.basketRepo.save(basket);
		}

		const all_basket = await this.basketRepo.find({
			where: { user },
			relations: { product: true },
			order: { id: "DESC" },
		});

		const message = responseByLang("update", lang);
		return { status_code: 200, data: all_basket, message };
	}

	/** create multiple baskets */
	public async createMultipleBasket(
		dto: CreateMultipleBasketDto,
		lang: string,
		user: ExecuterEntity,
	): Promise<IResponse<BasketEntity[]>> {
		const query = this.dataSource.createQueryRunner();
		await query.connect();
		await query.startTransaction();

		try {
			for (let basket of dto.basket) {
				const old_basket = await this.basketRepo.findOne({
					where: { user, product: { id: basket.product.id } },
				});

				const { data: product } = await this.productService.findOneById(
					basket.product.id,
					lang,
					{ where: { is_deleted: false } },
				);

				if (old_basket) {
					let total_quantity = 0;

					if (product.amount >= basket.amount + old_basket.amount) {
						total_quantity = basket.amount + old_basket.amount;
					} else {
						total_quantity = basket.amount;
					}

					if (total_quantity > product.amount) {
						throw new NotEnoughProduct();
					}

					await query.manager.update("user_basket", old_basket.id, {
						amount: total_quantity,
					});
				} else {
					if (product.amount < basket.amount) {
						throw new NotEnoughProduct();
					}
					const create_basket = query.manager.create("user_basket", { ...basket, user });
					await query.manager.save("user_basket", create_basket);
				}
			}

			await query.commitTransaction();
		} catch (error) {
			await query.rollbackTransaction();
			throw error;
		} finally {
			await query.release();
		}

		const all_basket = await this.basketRepo.find({
			where: { user },
			relations: { product: true },
			order: { id: "DESC" },
		});
		const message = responseByLang("create", lang);

		return { status_code: 201, data: all_basket, message };
	}

	/** delete all user baskets */
	public async removeAllUserBasket(lang: string, user: ExecuterEntity): Promise<IResponse<[]>> {
		const { data: user_baskets } = await this.findAll(lang, {
			where: { user: { id: user.id } },
		});

		if (user_baskets.length == 0) {
			throw new BasketNotFound();
		}

		await this.basketRepo.delete(user_baskets.map((item) => item.id));

		const message = responseByLang("delete", lang);
		return { status_code: 200, data: [], message };
	}

	/** get all user baskets */
	public async findUserBaskets(lang: string, user: ExecuterEntity) {
		const basket = await this.findAll(lang, {
			where: { user: user },
			relations: { product: true },
			order: { id: "DESC" },
		});

		basket.data = basket.data.map((item) => {
			item.product = this.productService.filterProductByLang([item.product], lang)[0];
			return item;
		});

		return basket;
	}
}
