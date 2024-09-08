import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatus, Roles } from "src/common/database/Enums";
import {
	OrderEntity,
	OrderItemEntity,
	UserCreditCardEntity,
	ExecuterEntity,
	UserLocationEntity,
} from "src/core/entity";
import {
	OrderItemRepository,
	OrderRepository,
	UserCreditCardRepository,
	UserLocationRepository,
} from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { In } from "typeorm";
import { BasketService } from "../basket/basket.service";
import { ProductService } from "../product/product.service";
import { ChangeOrderStatusDto } from "./dto/change-order-status.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { SentIncorrectAmount } from "./exception/incorrect-amount";
import { ProductNotFound } from "./exception/product-not-found";
import { IResponse } from "src/common/type";
import { FilterUserSelfOrderDto } from "./dto/filter-user-self-order.dto";
import { FilterOrderDto } from "./dto/filter-order.dto";
import { UserCreditCardService } from "../user_credit_card/user_credit_card.service";
import { UserLocationService } from "../user-location/user-location.service";
import { CardNotFound } from "../user_credit_card/exception/card-not-found";
import { LocationNotFound } from "../user-location/exception/location-not-found";
import { ProductAmountNotEnough } from "./exception/product-amount-not-enough";
import { SendMsgFromBot } from "telegram-bot-sender";
import { config } from "../../config";
import { PromocodeService } from "../promocode/promocode.service";
import { InvalidStatusTransition } from "./exception/invalid_status_transition";

@Injectable()
export class OrderService extends BaseService<CreateOrderDto, UpdateOrderDto, OrderEntity> {
	constructor(
		@InjectRepository(OrderEntity) private readonly orderRepo: OrderRepository,
		@InjectRepository(OrderItemEntity) private readonly orderItemRepo: OrderItemRepository,
		@InjectRepository(UserCreditCardEntity)
		private readonly userCardRepo: UserCreditCardRepository,
		@InjectRepository(UserLocationEntity)
		private readonly userLocationRepo: UserLocationRepository,
		@Inject(forwardRef(() => BasketService))
		private basketService: BasketService,
		@Inject(forwardRef(() => ProductService))
		private productService: ProductService,
		@Inject(forwardRef(() => PromocodeService))
		private promocodeService: PromocodeService,
	) {
		super(orderRepo, "Order");
	}

	/** create order */
	// public async createOrder(dto: CreateOrderDto, user: ExecuterEntity, lang: string) {
	// 	try {
	// 		const { data: products } = await this.productService.findAll(lang, {
	// 			where: { id: In(dto.product.map((item) => item.id)), is_deleted: false },
	// 		});
	// 		console.log("o", products);

	// 		if (products.length < dto.product.length) {
	// 			throw new ProductNotFound();
	// 		}
	// 		const check_card = await this.userCardRepo.findOne({
	// 			where: { id: dto.user_credit_card.id, user: user },
	// 		});
	// 		const check_location = await this.userLocationRepo.findOne({
	// 			where: { id: dto.user_location.id, user: user },
	// 		});
	// 		if (!check_card) {
	// 			throw new CardNotFound();
	// 		}
	// 		// if (!check_location) {
	// 		// 	throw new LocationNotFound();
	// 		// }
	// 		let total_product_price = 0;
	// 		let total_given_discount = 0;

	// 		for (let dto_product of dto.product) {
	// 			console.log(products);

	// 			const product = products.find((p) => p.id === dto_product.id);
	// 			console.log(product);

	// 			if (!product) {
	// 				throw new ProductNotFound();
	// 			}

	// 			if (dto_product.amount > product.amount) {
	// 				throw new ProductAmountNotEnough();
	// 			}
	// 			let given_discount = 0;
	// 			if (product.discount) {
	// 				given_discount = Number(product.price) - Number(product.discount_price) || 0; // discount may be optional
	// 			}
	// 			total_product_price += Number(product.price) * Number(dto_product.amount);
	// 			total_given_discount += given_discount * dto_product.amount;
	// 		}

	// 		const total_to_pay = total_product_price - total_given_discount;

	// 		// Dtodan kelayotgan qiymatlar bilan backendda hisoblangan datalar qiymatini tekshirish
	// 		if (
	// 			total_product_price !== dto.total_price ||
	// 			total_given_discount !== dto.given_discount ||
	// 			total_to_pay !== dto.total_to_pay ||
	// 			dto.total_price - dto.given_discount !== dto.total_to_pay
	// 		) {
	// 			throw new SentIncorrectAmount();
	// 		}
	// 		let check_number = 1000;
	// 		const exist_check_number = await this.orderRepo
	// 			.createQueryBuilder("order")
	// 			.select(["max(order.check_number) AS max_value"])
	// 			.getRawOne();

	// 		if (exist_check_number.max_value) {
	// 			check_number = +exist_check_number.max_value + 1;
	// 		}

	// 		const order: OrderEntity = await this.orderRepo.save(
	// 			this.getRepository.create({
	// 				total_price: total_product_price,
	// 				user_location: dto.user_location,
	// 				user_credit_card: dto.user_credit_card,
	// 				given_discount: total_given_discount,
	// 				total_to_pay: total_to_pay,
	// 				order_items: [],
	// 				check_number: check_number + "",
	// 				user,
	// 			}),
	// 		);

	// 		for (let item of dto.product) {
	// 			const product = products.find((p) => p.id === item.id);

	// 			if (!product) {
	// 				throw new ProductNotFound();
	// 			}
	// 			let to_pay = product.price;
	// 			let given_discount = 0;
	// 			if (product.discount) {
	// 				given_discount = product.price - product.discount_price || 0; // discount may be optional
	// 				to_pay = product.discount_price;
	// 			}

	// 			await this.orderItemRepo.save(
	// 				this.orderItemRepo.create({
	// 					product_name_en: product.name_en,
	// 					product_name_ru: product.name_ru,
	// 					product_name_uz: product.name_uz,

	// 					amount: item.amount,
	// 					price: product.price,
	// 					given_discount: given_discount,
	// 					to_pay: to_pay,
	// 					order,
	// 					product,
	// 				}),
	// 			);

	// 			await this.productService.update(
	// 				product.id,
	// 				{
	// 					amount: product.amount - item.amount,
	// 				},
	// 				lang,
	// 			);
	// 		}
	// 		// await this.basketService.removeAllUserBasket(lang, user);

	// 		const message = responseByLang("create", lang);
	// 		return { status_code: 201, data: {}, message };
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

	public async createOrder(dto: CreateOrderDto, user: ExecuterEntity, lang: string) {
		try {
			const { data: products } = await this.productService.findAll(lang, {
				where: { id: In(dto.product.map((item) => item.id)), is_deleted: false },
			});
			if (products.length < dto.product.length) {
				throw new ProductNotFound();
			}
			const check_card = await this.userCardRepo.findOne({
				where: { id: dto.user_credit_card.id, user: user },
			});
			const check_location = await this.userLocationRepo.findOne({
				where: { id: dto.user_location.id, user: user },
			});
			if (!check_card) {
				throw new CardNotFound();
			}
			if (!check_location) {
				throw new LocationNotFound();
			}
			let promocode;
			if (dto.promocode) {
				promocode = await this.promocodeService.findOneBy(lang, {
					where: { promocode: dto.promocode, is_deleted: false, is_active: true },
				});
			}
			let total_product_price = 0;
			let total_given_discount = 0;

			for (let dto_product of dto.product) {
				// console.log(products);

				const product = products.find((p) => p.id === dto_product.id);
				// console.log(product);

				if (!product) {
					throw new ProductNotFound();
				}

				if (dto_product.amount > product.amount) {
					throw new ProductAmountNotEnough();
				}
				let given_discount = 0;
				if (product.discount) {
					given_discount = Number(product.price) - Number(product.discount_price) || 0; // discount may be optional
					given_discount = parseFloat(given_discount.toFixed(2)); // Round to 2 decimal places
				}
				total_product_price += Number(product.price) * Number(dto_product.amount);
				total_given_discount += given_discount * dto_product.amount;
			}
			let total_to_pay = total_product_price - total_given_discount;

			if (promocode) {
				total_to_pay = total_to_pay - (promocode.data.percentage * dto.total_price) / 100;
			}
			if (
				total_product_price !== dto.total_price || // Mahsulotlarning umumiy narxi noto'g'ri bo'lsa
				total_given_discount !== dto.given_discount || // Umumiy berilgan chegirma noto'g'ri bo'lsa
				(promocode && // Agar promo kod mavjud bo'lsa
					total_to_pay !==
						dto.total_price -
							((promocode.data.percentage * dto.total_price) / 100 +
								dto.given_discount)) || // Promokodni inobatga olgan holda to'lov miqdorini tekshirish
				(!promocode && // Agar promo kod mavjud bo'lmasa
					dto.total_price - dto.given_discount !== dto.total_to_pay) || // Chegirma va umumiy narxni tekshirish
				total_to_pay !== dto.total_to_pay // Yopilgan to'lov miqdori noto'g'ri bo'lsa
			) {
				throw new SentIncorrectAmount(); // Noto'g'ri summalar yuborilgan bo'lsa, xato qaytarish
			}

			let check_number = 1000;
			const exist_check_number = await this.orderRepo
				.createQueryBuilder("order")
				.select(["max(order.check_number) AS max_value"])
				.getRawOne();

			if (exist_check_number.max_value) {
				check_number = +exist_check_number.max_value + 1;
			}

			const order: OrderEntity = await this.orderRepo.save(
				this.getRepository.create({
					total_price: total_product_price,
					user_location: dto.user_location,
					user_credit_card: dto.user_credit_card,
					given_discount: total_given_discount,
					promocode: promocode?.data.promocode,
					promo_percent: promocode?.data.percentage,
					total_to_pay: total_to_pay,
					order_items: [],
					check_number: check_number + "",
					user,
				}),
			);

			let productDetails = "";
			let count = 0;
			for (let item of dto.product) {
				const product = products.find((p) => p.id === item.id);

				if (!product) {
					throw new ProductNotFound();
				}
				let to_pay = product.price;
				let given_discount = 0;
				if (product.discount) {
					given_discount = product.price - product.discount_price || 0; // discount may be optional
					to_pay = product.discount_price;
				}

				await this.orderItemRepo.save(
					this.orderItemRepo.create({
						product_name_en: product.name_en,
						product_name_ru: product.name_ru,
						product_name_uz: product.name_uz,

						amount: item.amount,
						price: product.price,
						given_discount: given_discount,
						to_pay: to_pay,
						order,
						product,
					}),
				);
				productDetails += `${++count}. ${product.name_uz}\n  ${product.price} x ${
					item.amount
				} dona = ${product.price * item.amount} $\n\n`;

				await this.productService.update(
					product.id,
					{
						amount: product.amount - item.amount,
					},
					lang,
				);
			}
			await this.basketService.removeAllUserBasket(lang, user);
			const orderMessage = `
Buyurtma raqami: ${order.check_number}

🙍‍♂️ Mijoz: ${user.first_name}

📃 Mahsulotlar:
${productDetails}

💸 Umumiy qiymati: ${order.total_to_pay} $

📍 Manzil: ${
				check_location
					? `${check_location.country}, ${check_location.city}, ${check_location.street}, ${check_location.name_of_address}`
					: "Manzil mavjud emas"
			}

🕔 Buyurtma vaqti: ${new Date(new Date().getTime() + 5 * 60 * 60 * 1000)
				.toISOString()
				.replace("T", " ")
				.substring(0, 19)}
        `;
			try {
				// SendMsgFromBot(
				// 	config.BOT_TOKEN,
				// 	config.CHAT_ID,
				// 	[{ key: "Yangi buyurtma", value: orderMessage }],
				// 	// "title",
				// );
			} catch (error) {
				console.log("ErRoR", error);

				throw error;
			}

			const message = responseByLang("create", lang);
			return { status_code: 201, data: {}, message };
		} catch (error) {
			throw error;
		}
	}

	/** update order status */
	public async updateOrderStatus(
		id: string,
		dto: ChangeOrderStatusDto,
		lang: string,
		admin: ExecuterEntity,
	) {
		// Buyurtmani topish
		const order = await this.findOneBy(lang, {
			where: {
				id,
				status: In([
					OrderStatus.PENDING,
					OrderStatus.APPROVED,
					OrderStatus.DELIVERED,
					OrderStatus.FINISHED,
					OrderStatus.CANCELLED,
				]),
				is_deleted: false,
			},
		});
		// Ruxsat etilgan statuslar ketma-ketligi
		const statusTransitions: Record<OrderStatus, OrderStatus> = {
			[OrderStatus.PENDING]: OrderStatus.APPROVED,
			[OrderStatus.APPROVED]: OrderStatus.DELIVERED,
			[OrderStatus.DELIVERED]: OrderStatus.FINISHED,
			[OrderStatus.FINISHED]: OrderStatus.FINISHED, // FINISHED holatida o'zgarish bo'lmasin
			[OrderStatus.CANCELLED]: OrderStatus.CANCELLED, // CANCELLED holatida o'zgarish bo'lmasin
		};

		// Buyurtma statusidan keyingi ruxsat etilgan holatlarni tekshirish
		const currentStatus = order.data.status as OrderStatus;
		const allowedStatus = statusTransitions[currentStatus];

		if (dto.status !== allowedStatus) {
			throw new InvalidStatusTransition(); // noto'g'ri holat o'tishiga ruxsat berilmasin
		}

		// Buyurtma holatini yangilash
		await this.orderRepo.update(id, { status: dto.status});

		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}

	/** cacelled order by admin */
	public async cancelOrder(
		id: string,
		lang: string,
		admin: ExecuterEntity,
	): Promise<IResponse<[]>> {
		const { data: order } = await this.findOneBy(lang, {
			where: { id, status: OrderStatus.PENDING },
			relations: { order_items: { product: true } },
		});

		for (let item of order.order_items) {
			await this.productService.update(
				item.product.id,
				{ amount: item.product.amount + item.amount },
				lang,
			);
		}

		order.status = OrderStatus.CANCELLED;
		if (admin.role == Roles.ADMIN || admin.role == Roles.SUPER_ADMIN)
			// order.admin = admin as unknown as AdminEntity;
		await this.getRepository.save(order);

		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}

	/** find all order for admin */
	public async findAllOrder(lang: string, query: FilterOrderDto) {
		let option = {};

		if (query.status) {
			option = { status: query.status };
		}

		const order = await this.findAllWithPagination(lang, {
			order: { id: "DESC" },
			where: { ...option, is_deleted: false },
			relations: {
				order_items: { product: true },
				user: true,
				user_location: true,
				user_credit_card: true,
				// admin: true,
			},
			take: query.page_size,
			skip: query.page,
		});

		order.data = order.data.map((item) => {
			item.order_items = this.filterProductInOrderItemByLang(item.order_items, lang);
			return item;
		});

		return order;
	}

	/** find one for admin */
	public async findOneOrder(id: string, lang: string) {
		const order = await this.findOneById(id, lang, {
			where: { is_deleted: false },
			relations: {
				order_items: { product: true },
				user: true,
				user_location: true,
				user_credit_card: true,
				// admin: true,
			},
		});

		order.data.order_items = this.filterProductInOrderItemByLang(order.data.order_items, lang);

		return order;
	}

	/** get all product for user */
	public async findUserSelfAllOrder(
		query: FilterUserSelfOrderDto,
		lang: string,
		user: ExecuterEntity,
	): Promise<IResponse<OrderEntity[]>> {
		let where = {};
		if (query.status == "true") {
			where = {
				status: In([OrderStatus.APPROVED, OrderStatus.PENDING]),
			};
		} else if (query.status == "false") {
			where = {
				status: In([OrderStatus.CANCELLED, OrderStatus.FINISHED]),
			};
		}

		const { data: _order } = await this.findAll(lang, {
			where: {
				user,
				is_deleted: false,
				...where,
			},
			relations: {
				order_items: { product: true },
				user_location: true,
				user_credit_card: true,
			},
			order: { id: "DESC" },
		});

		const order = _order.map((item) => {
			item.order_items = this.filterProductInOrderItemByLang(item.order_items, lang);
			return item;
		});

		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: order, message };
	}

	/** find one order for user */
	public async findUserSelfOneOrder(id: string, lang: string, user: ExecuterEntity) {
		const order = await this.findOneById(id, lang, {
			where: { user, is_deleted: false },
			relations: {
				order_items: { product: true },
				user_location: true,
				user_credit_card: true,
			},
		});

		order.data.order_items = this.filterProductInOrderItemByLang(order.data.order_items, lang);

		return order;
	}

	public filterProductInOrderItemByLang(dto: OrderItemEntity[], lang: string) {
		return dto.map((item) => {
			if (lang == "uz") {
				return {
					...item,
					product_name: item.product_name_uz,
				};
			} else if (lang == "ru") {
				return {
					...item,
					product_name: item.product_name_ru,
				};
			} else if (lang == "en") {
				return {
					...item,
					product_name: item.product_name_en,
				};
			} else {
				return {
					...item,
					product_name: item.product_name_en,
				};
			}
		});
	}
}
export function getMessage(kalit: string, qiymat: string) {
	return { key: kalit, value: qiymat };
}
