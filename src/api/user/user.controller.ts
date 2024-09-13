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
	ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { FilterDto } from "src/common/dto/filter.dto";
import { ExecuterEntity } from "src/core/entity";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";

@Controller("/user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	// @Post()
	// public createUser(@Body() dto: CreateUserDto, @CurrentLanguage() lang: string) {
	// 	return this.userService.createUser(dto, lang);
	// }

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.userService.findAllWithPagination(lang, {
			order: { id: "DESC" },
			where: { is_deleted: false },
			relations: { locations: true },
			take: query.page_size,
			skip: query.page,
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Get("/get-self-user-info")
	public findSelfUserInfo(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.userService.findOneBy(lang, {
			where: { id: executerPayload.executer.id, is_deleted: false },
			relations: { locations: true },
		});
	}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	// @Get(":id")
	// public findOne(@Param("id", ParseIntPipe) id: number, @CurrentLanguage() lang: string) {
	// 	return this.userService.findOneById(id, lang);
	// }

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Patch("update-self-user-info")
	public updateUserSelfInfo(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
		@Body() dto: UpdateUserDto,
	) {
		return this.userService.updateUserSelfInfo(dto, lang, user);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Delete("delete-user-self-account")
	public removeSelfUser(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.userService.delete(user.id, lang);
	}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.USER)
	// @Patch("change-password")
	// public changPassword(
	// 	@CurrentLanguage() lang: string,
	// 	@CurrentUser() user: ExecuterEntity,
	// 	@Body() dto: ChangePasswordDto,
	// ) {
	// 	return this.userService.changePassword(dto, user, lang);
	// }
}
