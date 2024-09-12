import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	ParseIntPipe,
} from "@nestjs/common";
import { UserCreditCardService } from "./user_credit_card.service";
import { CreateUserCreditCardDto } from "./dto/create-user_credit_card.dto";
import { UpdateUserCreditCardDto } from "./dto/update-user_credit_card.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { Roles } from "../../common/database/Enums";
import { Forbidden } from "../auth/exception";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ExecuterEntity } from "../../core/entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("user-credit-card")
export class UserCreditCardController {
	constructor(private readonly userCreditCardService: UserCreditCardService) {}

	@RolesDecorator(Roles.USER)
	@Post()
	async createUserCard(
		@Body() dto: CreateUserCreditCardDto,
		@CurrentExecuter() user: ExecuterEntity,
		@CurrentLanguage() lang: string,
	) {
		return this.userCreditCardService.createCard(dto, user, lang);
	}

	@RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
	@Get()
	findAll(@CurrentLanguage() lang: string) {
		return this.userCreditCardService.findAll(lang, {
			relations: { user: true },
			where: { is_deleted: false },
			order: {
				created_at: "DESC",
			},
		});
	}

	@RolesDecorator(Roles.USER)
	@Get("all-by-user")
	findAllByUSer(@CurrentLanguage() lang: string, @CurrentExecuter() user: ExecuterEntity) {
		return this.userCreditCardService.findAllCardByUser(user, lang);
	}

	@RolesDecorator(Roles.USER, Roles.ADMIN, Roles.SUPER_ADMIN)
	@Get(":id")
	async findOne(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		const found_credit = await this.userCreditCardService.findOneById(id, lang, {
			relations: { user: true },
			where: { is_deleted: false },
		});

		if (user.role == Roles.USER && found_credit.data.user.id !== user.id) {
			throw new Forbidden();
		}
		return found_credit;
	}

	@RolesDecorator(Roles.USER)
	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() dto: UpdateUserCreditCardDto,
		@CurrentExecuter() user: ExecuterEntity,
		@CurrentLanguage() lang: string,
	) {
		return this.userCreditCardService.updateCard(id, dto, user, lang);
	}

	@RolesDecorator(Roles.USER)
	@Delete(":id")
	remove(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.userCreditCardService.deleteCard(id, user, lang);
	}
}
