import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { ExecuterEntity } from "src/core/entity";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { BasketService } from "./basket.service";
import { CreateBasketDto, CreateMultipleBasketDto } from "./dto/create-basket.dto";
import { UpdateBasketDto } from "./dto/update-basket.dto";
import { CurrentExecuter } from "../../common/decorator/current-user";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("basket")
export class BasketController {
	constructor(private readonly basketService: BasketService) {}

	@RolesDecorator(Roles.USER)
	@Post()
	public create(
		@Body() dto: CreateBasketDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.basketService.createBasket(dto, lang, user);
	}

	@RolesDecorator(Roles.USER)
	@Post("create-multiple")
	public createMoreBasket(
		@Body() dto: CreateMultipleBasketDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.basketService.createMultipleBasket(dto, lang, user);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.basketService.findAll(lang, {
			order: { id: "DESC" },
			relations: { product: true, user: true },
		});
	}

	@RolesDecorator(Roles.USER)
	@Get("user-basket")
	public findUserBaskets(@CurrentLanguage() lang: string, @CurrentExecuter() user: ExecuterEntity) {
		return this.basketService.findUserBaskets(lang, user);
	}

	@RolesDecorator(Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	updateBasket(
		@Param("id") id: string,
		@Body() dto: UpdateBasketDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.basketService.updateBasket(id, dto, lang, user);
	}

	@RolesDecorator(Roles.USER)
	@Delete("remove-user-basket")
	removeAllUserBasket(@CurrentLanguage() lang: string, @CurrentExecuter() user: ExecuterEntity) {
		return this.basketService.removeAllUserBasket(lang, user);
	}
}
