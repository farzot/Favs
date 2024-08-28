import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards
} from "@nestjs/common";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { ExecuterEntity } from "src/core/entity";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { ChangeOrderStatusDto } from "./dto/change-order-status.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FilterOrderDto } from "./dto/filter-order.dto";
import { FilterUserSelfOrderDto } from "./dto/filter-user-self-order.dto";
import { OrderService } from "./order.service";
import { CurrentExecuter } from "../../common/decorator/current-user";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("order")
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@RolesDecorator(Roles.USER)
	@Post()
	public create(
		@Body() dto: CreateOrderDto,
		@CurrentExecuter() user: ExecuterEntity,
		@CurrentLanguage() lang: string,
	) {
		return this.orderService.createOrder(dto, user, lang);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string, @Query() query: FilterOrderDto) {
		return this.orderService.findAllOrder(lang, query);
	}

	@RolesDecorator(Roles.USER)
	@Get("get-user-self-order")
	public findUserSelfOrder(
		@Query() query: FilterUserSelfOrderDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.orderService.findUserSelfAllOrder(query, lang, user);
	}

	@RolesDecorator(Roles.USER)
	@Get("get-user-self-order/:id")
	public findUserSelfOneOrder(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.orderService.findUserSelfOneOrder(id, lang, user);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get(":id")
	public findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.orderService.findOneOrder(id, lang);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.USER)
	@Patch("order-cancel/:id")
	public cancelOrder(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() admin: ExecuterEntity,
	) {
		return this.orderService.cancelOrder(id, lang, admin);
	}

	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch("change-status/:id")
	public updateOrderStatus(
		@Param("id") id: string,
		@Body() dto: ChangeOrderStatusDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() admin: ExecuterEntity,
	) {
		return this.orderService.updateOrderStatus(id, dto, lang, admin);
	}
}
