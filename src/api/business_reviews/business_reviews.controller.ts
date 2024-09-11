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
	Query,
	UseGuards,
} from "@nestjs/common";
import { BusinessReviewsService } from "./business_reviews.service";
import { CreateBusinessReviewDto } from "./dto/create-business_review.dto";
import { UpdateBusinessReviewDto } from "./dto/update-business_review.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { FileRequiredException } from "../file/exception/file.exception";
import { createFile } from "../../infrastructure/lib/fileService";
import { BusinessReviewEntity } from "../../core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessReviewRepository } from "../../core/repository";
import { UserService } from "../user/user.service";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { FilterDto } from "../../common/dto/filter.dto";
import { FindOptionsWhereProperty } from "typeorm";
import { ReviewFilterDto } from "./dto/review-filter.dto";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { ClientBusinessService } from "../business/service/client-business.service";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";

@Controller("/business-review")
export class BusinessReviewsController {
	constructor(
		private readonly businessReviewsService: BusinessReviewsService,
		private readonly businessService: ClientBusinessService,
		private readonly userService: UserService,
		@InjectRepository(BusinessReviewEntity)
		private readonly reviewRepo: BusinessReviewRepository,
	) {}
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	@UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 4 }]))
	public async create(
		@Body() dto: CreateBusinessReviewDto,
		@UploadedFiles()
		files: { images: Express.Multer.File[] },
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const new_review = new BusinessReviewEntity();
		if (!files.images) {
			throw new FileRequiredException();
		}
		let uploaded_files: string[] = [];
		files.images.map(async (image: any) => {
			const uploaded = await createFile(image);
			uploaded_files.push(uploaded);
		});
		const { data: founded_business } = await this.businessService.findOneById(
			dto.business,
			lang,
			{
				where: { is_deleted: false },
			},
		);
		const { data: founded_user } = await this.userService.findOneById(
			executerPayload.executer.id,
			lang,
			{
				where: { is_deleted: false },
			},
		);
		new_review.images = uploaded_files;
		new_review.text = dto.text;
		new_review.rating = dto.rating;
		new_review.business = founded_business;
		new_review.user = founded_user;
		const data = await this.reviewRepo.save(new_review);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			message,
			data,
		};
	}

	@Get()
	async findAll(@CurrentLanguage() lang: string, @Query() query: ReviewFilterDto) {
		let where_condition: FindOptionsWhereProperty<BusinessReviewEntity> = {};
		if (query.username) {
			where_condition = [
				{ user: { username: query.username, is_deleted: false }, is_deleted: false },
			];
		}
		let { data: reviews } = await this.businessReviewsService.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: {},
			order: { created_at: "DESC" },
		});
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: reviews, message };
	}

	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateBusinessReviewDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false, user: { id: executerPayload.executer.id } },
		});
		return this.businessReviewsService.update(id, dto, lang, executerPayload.executer);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete(":id")
	async remove(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false, user: { id: executerPayload.executer.id } },
		});
		return this.businessReviewsService.delete(id, lang, executerPayload.executer);
	}
}
