import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateUserCreditCardDto } from "./dto/create-user_credit_card.dto";
import { UpdateUserCreditCardDto } from "./dto/update-user_credit_card.dto";
import { BaseService } from "../../infrastructure/lib/baseService";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhereProperty, Repository } from "typeorm";
import { UserCreditCardEntity, ExecuterEntity } from "../../core/entity";
import { Forbidden, InvalidToken, UserNotFound } from "../auth/exception";
import { UserService } from "../user/user.service";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "../../common/type";
import { CardNotFound } from "./exception/card-not-found";
import { UserCreditCardRepository } from "../../core/repository";
import { CardAlreadyExists } from "./exception/card-already-exists";

@Injectable()
export class UserCreditCardService extends BaseService<
	CreateUserCreditCardDto,
	UpdateUserCreditCardDto,
	UserCreditCardEntity
> {
	constructor(
		@InjectRepository(UserCreditCardEntity)
		private readonly userCreditCardRepository: UserCreditCardRepository,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
	) {
		super(userCreditCardRepository, "UserCreditCard");
	}
	async createCard(dto: CreateUserCreditCardDto, user: ExecuterEntity, lang: string) {
		try {
			const new_credit_card = new UserCreditCardEntity();

			const check_card_number = await this.getRepository.findOne({
				where: {
					card_number: dto.card_number,
				},
			});
			if (check_card_number) {
				throw new CardAlreadyExists();
			}
			new_credit_card.user = user;
			new_credit_card.card_number = dto.card_number;
			new_credit_card.expire_month = dto.expire_month;
			new_credit_card.expire_year = dto.expire_year;
			new_credit_card.cvv = dto.cvv;
			new_credit_card.is_visa = dto.is_visa;
			const data = await this.userCreditCardRepository.save(new_credit_card);
			const message = responseByLang("create", lang);
			return { status_code: 201, message, data };
		} catch (err) {
			throw err;
		}
	}
	async findAllCardByUser(
		owner: ExecuterEntity,
		lang: string,
	): Promise<IResponse<UserCreditCardEntity[]>> {
		try {
			let where_condition: FindOptionsWhereProperty<UserCreditCardEntity> = {
				is_deleted: false,
				user: owner,
			};
			const cards = await this.findAll(lang, {
				relations: { user: true },
				where: where_condition,
				order: {
					created_at: "DESC",
				},
			});
			if (!cards) {
				throw new CardNotFound();
			}
			const message = responseByLang("get_all", lang);
			return { status_code: 200, data: cards.data, message };
		} catch (err) {
			throw err;
		}
	}
	async updateCard(id: string, dto: UpdateUserCreditCardDto, user: ExecuterEntity, lang: string) {
		try {
			const { data: card } = await this.findOneById(id, lang, {
				relations: { user: true },
				where: { is_deleted: false },
			});

			if (user.id !== card.user.id) {
				throw new Forbidden();
			}

			const check_card_number = await this.getRepository.findOne({
				where: {
					card_number: dto.card_number,
				},
			});

			if (check_card_number) {
				throw new CardAlreadyExists();
			}

			card.card_number = dto.card_number || card.card_number;
			card.expire_month = dto.expire_month || card.expire_month;
			card.expire_year = dto.expire_year || card.expire_year;
			card.is_visa = dto.is_visa || card.is_visa;

			if (card.is_visa) {
				card.cvv = dto.cvv || card.cvv;
			}

			card.updated_at = Date.now();
			await this.getRepository.save(card);

			const message = responseByLang("update", lang);
			return { status_code: 200, data: card, message };
		} catch (err) {
			throw err;
		}
	}
	async deleteCard(id: string, user: ExecuterEntity, lang: string) {
		try {
			const { data: card } = await this.findOneById(id, lang, {
				relations: { user: true },
				where: { is_deleted: false },
			});

			if (user.id !== card.user.id) {
				throw new Forbidden();
			}

			await this.delete(id, lang);

			const message = responseByLang("delete", lang);
			return { status_code: 200, message, data: [] };
		} catch (err) {
			throw err;
		}
	}
}
