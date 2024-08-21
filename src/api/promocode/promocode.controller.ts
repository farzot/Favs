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
import { PromocodeService } from "./promocode.service";
import { CreatePromocodeDto } from "./dto/create-promocode.dto";
import { UpdatePromocodeDto } from "./dto/update-promocode.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "../../common/database/Enums";


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("promocode")
export class PromocodeController {
	constructor(private readonly promocodeService: PromocodeService) {}

	@RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
	@Post()
	async create(@Body() createPromocodeDto: CreatePromocodeDto, @CurrentLanguage() lang: string) {
		return await this.promocodeService.create(createPromocodeDto, lang);
	}

	@RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
	@Get()
	async findAll(@CurrentLanguage() lang: string) {
		return await this.promocodeService.findAll(lang, {
			where: { is_deleted: false },
			order: {
				created_at: "DESC",
			},
		});
	}

	@RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return await this.promocodeService.findOneById(id, lang, { where: { is_deleted: false } });
	}

	@RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
	@Get("/promo/:promo")
	async findOneByName(@Param("promo") promo: string, @CurrentLanguage() lang: string) {
		console.log(`promo`, promo);
		return await this.promocodeService.findOneBy(lang, {
			where: { promocode: promo, is_deleted: false, is_active: true },
		});
	}

	@RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() updatePromocodeDto: UpdatePromocodeDto,
		@CurrentLanguage() lang: string,
	) {
		await this.promocodeService.findOneById(id, lang, { where: { is_deleted: false } });
		return await this.promocodeService.update(id, updatePromocodeDto, lang);
	}

	@RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.promocodeService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.promocodeService.delete(id, lang);
	}
}
