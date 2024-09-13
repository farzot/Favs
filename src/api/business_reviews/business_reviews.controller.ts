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
import { BusinessEntity, BusinessReviewEntity, SmallCategoryEntity } from "../../core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import {
	BusinessRepository,
	BusinessReviewRepository,
	SmallCategoryRepository,
} from "../../core/repository";
import { UserService } from "../user/user.service";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { FilterDto } from "../../common/dto/filter.dto";
import { DataSource, FindOptionsWhereProperty } from "typeorm";
import { ReviewFilterDto } from "./dto/review-filter.dto";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { ClientBusinessService } from "../business/service/client-business.service";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { AuthorizationError } from "../auth/exception";

@Controller("/business-review")
export class BusinessReviewsController {
	constructor(
		private readonly businessReviewsService: BusinessReviewsService,
		private readonly businessService: ClientBusinessService,
		private readonly userService: UserService,
		@InjectRepository(BusinessReviewEntity)
		private readonly reviewRepo: BusinessReviewRepository,
		@InjectRepository(SmallCategoryEntity)
		private readonly smallCategoryRepo: SmallCategoryRepository,
		private readonly dataSource: DataSource,
	) {}

	// review post qilish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	@UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 4 }]))
	// public async create(
	// 	@Body() dto: CreateBusinessReviewDto,
	// 	@UploadedFiles() files: { images?: Express.Multer.File[] }, // Fayl optional bo'ldi
	// 	@CurrentLanguage() lang: string,
	// 	@CurrentExecuter() executerPayload: ICurrentExecuter,
	// ) {
	// 	const new_review = new BusinessReviewEntity();

	// 	// Fayllar bo'lmasa bo'sh ro'yxat yaratish
	// 	let uploaded_files: string[] = [];
	// 	if (files?.images && files.images.length > 0) {
	// 		await Promise.all(
	// 			files.images.map(async (image: any) => {
	// 				const uploaded = await createFile(image);
	// 				uploaded_files.push(uploaded);
	// 			}),
	// 		);
	// 	}

	// 	const { data: founded_business } = await this.businessService.findOneById(
	// 		dto.business,
	// 		lang,
	// 		{
	// 			where: { is_deleted: false },
	// 		},
	// 	);
	// 	founded_business.reviews_count += 1;
	// 	const { data: founded_user } = await this.userService.findOneById(
	// 		executerPayload.executer.id,
	// 		lang,
	// 		{
	// 			where: { is_deleted: false },
	// 		},
	// 	);

	// 	new_review.images = uploaded_files;
	// 	new_review.text = dto.text;
	// 	new_review.rating = dto.rating;
	// 	new_review.business = founded_business;
	// 	new_review.user = founded_user;

	// 	const data = await this.reviewRepo.save(new_review);
	// 	await this.businessRepo.save(founded_business);
	// 	const message = responseByLang("create", lang);
	// 	return {
	// 		status_code: 201,
	// 		message,
	// 		data,
	// 	};
	// }
	public async create(
		@Body() dto: CreateBusinessReviewDto,
		@UploadedFiles() files: { images?: Express.Multer.File[] }, // Fayl optional bo'ldi
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const new_review = new BusinessReviewEntity();

			// Fayllar bo'lmasa bo'sh ro'yxat yaratish
			let uploaded_files: string[] = [];
			if (files?.images && files.images.length > 0) {
				await Promise.all(
					files.images.map(async (image: any) => {
						const uploaded = await createFile(image);
						uploaded_files.push(uploaded);
					}),
				);
			}

			// Businessni topish
			const { data: founded_business } = await this.businessService.findOneById(
				dto.business,
				lang,
				{
					where: { is_deleted: false },
				},
			);

			// Foydalanuvchini topish
			const { data: founded_user } = await this.userService.findOneById(
				executerPayload.executer.id,
				lang,
				{
					where: { is_deleted: false },
				},
			);

			// Reviewni saqlash
			new_review.images = uploaded_files;
			new_review.text = dto.text;
			new_review.rating = dto.rating;
			new_review.business = founded_business;
			new_review.user = founded_user;

			const savedReview = await queryRunner.manager.save(BusinessReviewEntity, new_review);

			// Businessni yangilash: reviewlar sonini va o'rtacha yulduzlarni hisoblash
			const totalReviews = await this.reviewRepo.count({
				where: { business: { id: dto.business } },
			});
			founded_business.reviews_count = totalReviews + 1;

			// O'rtacha yulduz (average_star)ni hisoblash
			const allRatings = await this.reviewRepo.find({
				where: { business: { id: dto.business } },
				select: ["rating"],
			});
			const totalStars = allRatings.reduce((sum, review) => sum + review.rating, dto.rating);
			founded_business.average_star = totalStars / founded_business.reviews_count;

			// Businessni saqlash
			await queryRunner.manager.save(BusinessEntity, founded_business);

			// Tranzaksiyani yakunlash
			await queryRunner.commitTransaction();

			const message = responseByLang("create", lang);
			return {
				status_code: 201,
				message,
				data: savedReview,
			};
		} catch (error) {
			// Xatolik bo'lsa, tranzaksiyani bekor qilish
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			// Tranzaksiya tugagach, QueryRunner'ni bo'shatish
			await queryRunner.release();
		}
	}

	// barcha reviewlarni ko'rish bu yerda username, business_id orqali filter qilsa bo'ladi
	@Get()
	async findAll(@CurrentLanguage() lang: string, @Query() query: ReviewFilterDto) {
		let where_condition: FindOptionsWhereProperty<BusinessReviewEntity> = { is_deleted: false };
		if (query.username) {
			where_condition = [
				{ user: { username: query.username, is_deleted: false }, is_deleted: false },
			];
		}
		if (query.business_id) {
			where_condition = [
				{ business: { id: query.business_id, is_deleted: false }, is_deleted: false },
			];
		}
		let { data: reviews } = await this.businessReviewsService.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: { user: true },
			order: { created_at: "DESC" },
		});
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: reviews, message };
	}

	// review id orqali reviewni get qilish
	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false },
			relations: { user: true },
		});
	}

	// user id orqali reviewlarni get qilish
	@Get(":user_id/by-user-id")
	async findOneByUserID(@Param("id") user_id: string, @CurrentLanguage() lang: string) {
		return await this.businessReviewsService.findAllWithPagination(lang, {
			where: { is_deleted: false, user: { id: user_id } },
		});
	}

	// user o'zi yozgan barcha reviewlarni ko'rish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-all-self-review")
	async getAllSelfReviews(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return await this.businessReviewsService.findAllWithPagination(lang, {
			where: { user: executerPayload.executer, is_deleted: false },
		});
	}

	// user o'zi yozgan review ni id orqali yangilash qilish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateBusinessReviewDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const { data: founded_review } = await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false, user: { id: executerPayload.executer.id } },
		});
		if (founded_review.user != executerPayload.executer) {
			throw new AuthorizationError();
		}
		return this.businessReviewsService.update(id, dto, lang);
	}

	// user o'zi yozgan review ni id orqali o'chirish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete(":id")
	async remove(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const { data: founded_review } = await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false, user: { id: executerPayload.executer.id } },
		});
		if (founded_review.user != executerPayload.executer) {
			throw new AuthorizationError();
		}
		return this.businessReviewsService.delete(id, lang);
	}

	// Foydalanuvchi like bosganda
	@Post(":id/like")
	public async likeReview(@Param("id") id: string, @CurrentLanguage() lang: string) {
		const { data: review } = await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		review.like += 1;
		await this.reviewRepo.save(review);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			data: [],
			message,
		};
	}

	// Foydalanuvchi dislike bosganda
	@Post(":id/dislike")
	public async dislikeReview(@Param("id") id: string, @CurrentLanguage() lang: string) {
		const { data: review } = await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		review.dislike += 1;
		await this.reviewRepo.save(review);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			data: [],
			message,
		};
	}

	// userning self-reviewlardagi barchas yig'ilgan like va dislike lari
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/user-self-review-like-dislike")
	public async getSelfReviewLikeDislike(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<{ totalLikes: number; totalDislikes: number }> {
		const userId = executerPayload.executer.id;
		const message = responseByLang("get_one", lang);
		const result = await this.reviewRepo
			.createQueryBuilder("review")
			.select("SUM(review.like)", "totalLikes")
			.addSelect("SUM(review.dislike)", "totalDislikes")
			.where("review.user_id = :userId", { userId })
			.andWhere("review.is_deleted = false")
			.getRawOne();

		return {
			totalLikes: result.totalLikes || 0,
			totalDislikes: result.totalDislikes || 0,
		};
	}

	// userning businesslarda birinchi bo'lib yozilgan review lar soni
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/user-self-all-first-reviews")
	public async getUserFirstBusinessReviews(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<unknown> {
		const userId = executerPayload.executer.id;
		const message = responseByLang("get_one", lang);
		const subQuery = this.reviewRepo
			.createQueryBuilder("review")
			.select("MIN(review.created_at)", "minCreatedAt")
			.where("review.business_id = business.id")
			.andWhere("review.user_id = :userId", { userId });

		const data = this.reviewRepo
			.createQueryBuilder("review")
			.where("review.user_id = :userId", { userId })
			.andWhere(`review.created_at = (${subQuery.getQuery()})`)
			.getMany();
		return { status_code: 200, data: data, message };
	}

	// u user yozgan reviewlar sonini olish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/user-self-review-count")
	public async getUserSelfReviewCount(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<unknown> {
		const userId = executerPayload.executer.id;
		const message = responseByLang("get_one", lang);

		const data = await this.reviewRepo.count({
			where: {
				user: { id: userId },
				is_deleted: false,
			},
		});
		return { status_code: 200, data: data, message };
	}

	// userning businesslarda birinchi bo'lib yozilgan reviewlardagi barcha yig'ilgan like va dislike lari by user_id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-user-review-like-dislike/:userId")
	public async getUserewLikeDislike(
		@CurrentLanguage() lang: string,
		@Param("userId") userId: string, // userId params orqali qabul qilinadi
	): Promise<{ totalLikes: number; totalDislikes: number }> {
		const message = responseByLang("get_one", lang);
		const result = await this.reviewRepo
			.createQueryBuilder("review")
			.select("SUM(review.like)", "totalLikes")
			.addSelect("SUM(review.dislike)", "totalDislikes")
			.where("review.user_id = :userId", { userId })
			.andWhere("review.is_deleted = false")
			.getRawOne();

		return {
			totalLikes: result.totalLikes || 0,
			totalDislikes: result.totalDislikes || 0,
		};
	}

	// userning businesslarda birinchi bo'lib yozilgan review lar soni by user_id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-user-all-first-reviews/:userId")
	public async getUserAllFirstBusinessReviews(
		@CurrentLanguage() lang: string,
		@Param("userId") userId: string, // userId params orqali qabul qilinadi
	): Promise<unknown> {
		const message = responseByLang("get_one", lang);
		const subQuery = this.reviewRepo
			.createQueryBuilder("review")
			.select("MIN(review.created_at)", "minCreatedAt")
			.where("review.business_id = business.id")
			.andWhere("review.user_id = :userId", { userId });

		const data = await this.reviewRepo
			.createQueryBuilder("review")
			.where("review.user_id = :userId", { userId })
			.andWhere(`review.created_at = (${subQuery.getQuery()})`)
			.getMany();

		return { status_code: 200, data: data, message };
	}

	// user yozgan reviewlar sonini olish by user_id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-user-review-count/:userId")
	public async getUserReviewCount(
		@CurrentLanguage() lang: string,
		@Param("userId") userId: string, // userId params orqali qabul qilinadi
	): Promise<unknown> {
		const message = responseByLang("get_one", lang);

		const data = await this.reviewRepo.count({
			where: {
				user: { id: userId },
				is_deleted: false,
			},
		});
		return { status_code: 200, data: data, message };
	}

	// user id orqali user yozgan reviewlarning aynan qaysi categorylarga tegishli ekanligini soni bilan chiqarib berish
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/user-reviews-distribution/:userId")
	async getUserReviewsByCategory(@Param("userId") userId: string) {
		const userReviewsByCategory = await this.smallCategoryRepo
			.createQueryBuilder("sc")
			.select("sc.name_uz", "category_name")
			.addSelect("COUNT(br.id)", "review_count")
			.innerJoin("sc.businesses", "b")
			.innerJoin("b.reviews", "br")
			.innerJoin("br.user", "e")
			.where("e.id = :userId", { userId })
			.groupBy("sc.name_uz")
			.orderBy("review_count", "DESC")
			.getRawMany();

		return userReviewsByCategory;
	}

	// user yozgan reviewlarning aynan qaysi categorylarga tegishli ekanligini soni bilan chiqarib berish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/self-reviews-distribution")
	async getSelfReviewsByCategory(@CurrentExecuter() executerPayload: ICurrentExecuter) {
		const userId = executerPayload.executer.id;
		const userReviewsByCategory = await this.smallCategoryRepo
			.createQueryBuilder("sc")
			.select("sc.name_uz", "category_name")
			.addSelect("COUNT(br.id)", "review_count")
			.innerJoin("sc.businesses", "b")
			.innerJoin("b.reviews", "br")
			.innerJoin("br.user", "e")
			.where("e.id = :userId", { userId })
			.groupBy("sc.name_uz")
			.orderBy("review_count", "DESC")
			.getRawMany();
		return userReviewsByCategory;
	}
}
