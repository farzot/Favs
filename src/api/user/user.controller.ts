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
	ParseUUIDPipe,
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
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller("/executers")
export class UserController {
	constructor(private readonly userService: UserService) {}

	// @Post()
	// public createUser(@Body() dto: CreateUserDto, @CurrentLanguage() lang: string) {
	// 	return this.userService.createUser(dto, lang);
	// }

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/all-users")
	public findAllUsers(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.userService.findAllWithPagination(lang, {
			order: { id: "DESC" },
			where: { is_deleted: false, role: Roles.USER },
			relations: { locations: true },
			take: query.page_size,
			skip: query.page,
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/all-business-owners")
	public findAllBusinessOwners(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.userService.findAllWithPagination(lang, {
			order: { id: "DESC" },
			where: { is_deleted: false, role: Roles.BUSINESS_OWNER },
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

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get(":id")
	public findOne(@Param("id", ParseUUIDPipe) id: string, @CurrentLanguage() lang: string) {
		return this.userService.findOneById(id, lang, { where: { is_deleted: false } });
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Patch("/update-self-user-info")
	public updateUserSelfInfo(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@Body() dto: UpdateUserDto,
	) {
		return this.userService.updateUserSelfInfo(dto, lang, executerPayload.executer);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Delete("/delete-user-self-account")
	public async removeSelfUser(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.userService.delete(executerPayload.executer.id, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(
		Roles.USER,
		Roles.BUSINESS_MANAGER,
		Roles.BUSINESS_OWNER,
		Roles.ADMIN,
		Roles.SUPER_ADMIN,
	)
	@Patch("/self-change-password")
	public async changPassword(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@Body() dto: ChangePasswordDto,
	) {
		return await this.userService.changePassword(dto, executerPayload.executer, lang);
	}
}
