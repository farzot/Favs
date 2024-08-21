import {
	Controller,
	Get,
	Post,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	ParseIntPipe,
	UseGuards,
} from "@nestjs/common";
import { BannerService } from "./banner.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { deleteFile, multerImageUpload } from "src/infrastructure/lib/fileService";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { FileRequiredException } from "src/infrastructure/lib/fileService/exception/file.exception";
import { BannerEntity } from "src/core/entity/banner.entity";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";

@Controller("banner")
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	@UseInterceptors(FileInterceptor("file", multerImageUpload))
	async createBanner(@UploadedFile() file: Express.Multer.File, @CurrentLanguage() lang: string) {
		if (!file) {
			throw new FileRequiredException();
		}
		const new_banner = new BannerEntity();
		new_banner.banner_file = file.filename;
		const data = await this.bannerService.getRepository.save(new_banner);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			message,
			data,
		};
	}

	@Get()
	async getAllBanners(@CurrentLanguage() lang: string) {
		return this.bannerService.findAll(lang, {
			order: { created_at: "DESC" },
			where: {
				is_deleted: false,
			},
		});
	}

	@Get(":id")
	async getBannerByID(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.bannerService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	@UseInterceptors(FileInterceptor("file", multerImageUpload))
	async updateBanner(
		@Param("id") id: string,
		@UploadedFile() file?: Express.Multer.File,
		@CurrentLanguage() lang: string = "ru",
	) {
		const { data } = await this.bannerService.findOneById(id, lang);
		if (data) {
			if (file) {
				if (data.banner_file) {
					await deleteFile(data.banner_file);
				}
				await this.bannerService.getRepository.update(id, {
					banner_file: file.filename,
					updated_at: Date.now(),
				});
			}
		}
		const message = responseByLang("update", lang);
		return {
			status_code: 200,
			message,
			data: [],
		};
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Delete(":id")
	async deleteBanner(@Param("id") id: string, @CurrentLanguage() lang: string) {
		const { data } = await this.bannerService.findOneById(id, lang);
		if (data) {
			if (data.banner_file) {
				await deleteFile(data.banner_file);
			}
			await this.bannerService.delete(id, lang);
		}
		const message = responseByLang("delete", lang);
		return { status_code: 200, message, data: [] };
	}
}
