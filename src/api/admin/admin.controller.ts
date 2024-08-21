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
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { LoginDto } from "./dto/login.dto";
import { CurrentUser } from "src/common/decorator/current-user";
import { UserEntity } from "src/core/entity";

@Controller("admin")
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.SUPER_ADMIN)
	@Post()
	public create(@Body() dto: CreateAdminDto, @CurrentLanguage() lang: string) {
		return this.adminService.createAdmin(dto, lang);
	}

	@Post("login")
	public login(@Body() dto: LoginDto, @CurrentLanguage() lang: string) {
		return this.adminService.login(dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.adminService.findAll(lang, {
			order: { id: "DESC" },
			where: { is_deleted: false },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Get(":id")
	public findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.adminService.findOneById(id, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	public update(
		@Param("id") id: string,
		@Body() dto: UpdateAdminDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: UserEntity,
	) {
		return this.adminService.updateAdmin(id, dto, lang, user);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Delete(":id")
	public remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.adminService.delete(id, lang);
	}
}
