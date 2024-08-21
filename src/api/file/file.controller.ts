import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	UseGuards,
	Query,
} from "@nestjs/common";
import { FileService } from "./file.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerImageUpload, multerImageVideoUpload } from "src/infrastructure/lib/fileService";
import { FileRequiredException } from "./exception/file.exception";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FileEntity } from "../../core/entity";

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller("file")
export class FileController {
	constructor(private readonly fileService: FileService) {}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.SUPER_ADMIN)
	@Post()
	@UseInterceptors(FileInterceptor("file", multerImageVideoUpload))
	async create(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
		if (!file) {
			throw new FileRequiredException();
		}
		const newFile = new FileEntity();

		newFile.file_name = createFileDto.fileName || file.originalname;
		newFile.path = `${file.filename}`;
		newFile.mime_type = file.mimetype;
		newFile.size = file.size;

		const data = await this.fileService.getRepository.save(newFile);
		return { data, status: 201, message: "File successfully created" };
	}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.SUPER_ADMIN)
	@Get()
	findAll(@CurrentLanguage() lang: string, @Query() dto: PaginationDto) {
		return this.fileService.findAllWithPagination(lang, {
			take: dto.page_size,
			skip: dto.page,
		});
	}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.SUPER_ADMIN)
	@Get(":id")
	async findOne(@Param("id") id: string) {
		const lang = "en";
		return await this.fileService.findOneById(id, lang);
	}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.SUPER_ADMIN)
	@Delete(":id")
	async delete(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return await this.fileService.deleteFile(id, lang);
	}
}
