import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
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
import { CreateUserLocationDto } from "./dto/create-user-location.dto";
import { UpdateUserLocationDto } from "./dto/update-user-location.dto";
import { UserLocationService } from "./user-location.service";
import { CurrentExecuter } from "../../common/decorator/current-user";

@Controller("user-location")
export class UserLocationController {
	constructor(private readonly userLocationService: UserLocationService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Post("self-location")
	public async create(
		@Body() dto: CreateUserLocationDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.userLocationService.createUserLocation(dto, lang, user);
	}

	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.userLocationService.findAll(lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Get("self")
	public findSelfLocation(@CurrentLanguage() lang: string, @CurrentExecuter() user: ExecuterEntity) {
		return this.userLocationService.findAll(lang, {
			where: { user, is_deleted: false },
			order: { id: "DESC" },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Get("/:id")
	public findOneSelfLocation(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.userLocationService.findOneById(id, lang, {
			where: { user, is_deleted: false },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Patch("/:id")
	public async updateSelfLocation(
		@Param("id") id: string,
		@Body() dto: UpdateUserLocationDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		return this.userLocationService.updateUserLocation(id, dto, lang, user);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Delete("/:id")
	public async removeSelfLocation(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() user: ExecuterEntity,
	) {
		await this.userLocationService.findOneById(id, lang, { where: { user } });
		return this.userLocationService.delete(id, lang);
	}
}
