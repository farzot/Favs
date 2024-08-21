import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFiles,
	ParseIntPipe,
	UploadedFile,
	UseGuards,
} from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { Roles } from "../../common/database/Enums";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { UserEntity } from "../../core/entity";
import { CurrentUser } from "../../common/decorator/current-user";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller("feedback")
export class FeedbackController {
	constructor(private readonly feedbackService: FeedbackService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Post()
	@UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 1 }]))
	async createFeedback(
		@Body() createFeedbackDto: CreateFeedbackDto,
		@UploadedFiles()
		files: { images: Express.Multer.File[] },
		@CurrentUser() user: UserEntity,
		@CurrentLanguage() lang: string,
	) {
		return this.feedbackService.createFeedback(createFeedbackDto, files, user, lang);
	}

	@Get()
	async findAllFeedbacks(@CurrentLanguage() lang: string) {
		return this.feedbackService.findAll(lang, {
			where: { is_deleted: false },
			relations: { product: true, user: true },
			order: {
				created_at: "DESC",
			},
		});
	}

	@Get(":id")
	async findFeedbackByID(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.feedbackService.findOneById(id, lang, {
			where: { is_deleted: false },
			relations: { user: true, product: true },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 1 }]))
	@Patch(":id")
	async updateFeedback(
		@Param("id") id: string,
		@Body() dto: UpdateFeedbackDto,
		@UploadedFiles()
		files: { images: Express.Multer.File[] },
		@CurrentUser() user: UserEntity,
		@CurrentLanguage() lang: string,
	) {
		return this.feedbackService.updateFeedback(id, dto, files, user, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Delete(":id")
	async deleteFeedback(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: UserEntity,
	) {
		return this.feedbackService.deleteFeedback(id, user, lang);
	}

	@Get(":id/rate")
	async getAverageRate(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.feedbackService.getAverageRate(id, lang);
	}
}
