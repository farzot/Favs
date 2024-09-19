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
import { ExecuterEntity } from "src/core/entity";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";

@Controller("/admin")
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Post()
	public create(
		@Body() dto: CreateAdminDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.adminService.createAdmin(dto, lang, executerPayload.executer);
	}

	@Post("/create-super-admin")
	public createSuperAdmin(
		@Body() dto: CreateAdminDto,
		@CurrentLanguage() lang: string,
		// @CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.adminService.createSuperAdmin(dto,lang);
	}

	@Post("/login")
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
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.adminService.updateAdmin(id, dto, lang, executerPayload.executer);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Delete(":id")
	public remove(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.adminService.delete(id, lang, executerPayload.executer);
	}
}
