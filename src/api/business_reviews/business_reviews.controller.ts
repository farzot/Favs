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
	public async findAll(@CurrentLanguage() lang: string, @Query() query: ReviewFilterDto) {
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
	public async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false },
			relations: { user: true },
		});
	}

	// user id orqali reviewlarni get qilish
	@Get(":user_id/by-user-id")
	public async findOneByUserID(@Param("id") user_id: string, @CurrentLanguage() lang: string) {
		return await this.businessReviewsService.findAllWithPagination(lang, {
			where: { is_deleted: false, user: { id: user_id } },
		});
	}

	// user o'zi yozgan barcha reviewlarni ko'rish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-all-self-review")
	public async getAllSelfReviews(
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
	public async update(
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
	public async likeReview(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
	): Promise<{
		status_code: number;
		data: { likes: number };
		message: string;
	}> {
		const { data: review } = await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		console.log(review);
		review.like += 1;
		const res_review = await this.reviewRepo.save(review);
		console.log(res_review);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			data: { likes: review.like },
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
			data: [review.dislike],
			message,
		};
	}

	// user yozgan reviewlarning aynan qaysi categorylarga tegishli ekanligini soni bilan chiqarib berish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/self-user-reviews-distribution")
	public async getSelfReviewsByCategory(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<{
		status_code: number;
		data: { category_name: string; review_count: number }[];
		message: string;
	}> {
		const userId = executerPayload.executer.id;

		// Kategoriyalar bo'yicha user sharhlarini olish
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

		// Tilga mos xabarni olish
		const message = responseByLang("get_one", lang);

		// Natijalarni formatlash va qaytarish
		return {
			status_code: 200,
			data: userReviewsByCategory.map((item) => ({
				category_name: item.category_name,
				review_count: parseInt(item.review_count, 10),
			})),
			message: message,
		};
	}

	// userning self-reviewlardagi barchas yig'ilgan like va dislike lari
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/self-user-review-like-dislike")
	public async getSelfReviewLikeDislike(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<{
		status_code: number;
		data: { total_likes: number; total_dislikes: number };
		message: string;
	}> {
		// User ID ni executerPayload dan olamiz
		const userId = executerPayload.executer.id;

		// Til bo'yicha javobni olamiz
		const message = responseByLang("get_one", lang);

		// Like va Dislike summasini olamiz
		const result = await this.reviewRepo
			.createQueryBuilder("review")
			.select("SUM(review.like)", "total_likes")
			.addSelect("SUM(review.dislike)", "total_dislikes")
			.where("review.user_id = :userId", { userId })
			.andWhere("review.is_deleted = false")
			.getRawOne();

		// Ma'lumotlarni formatlash va qaytarish
		return {
			status_code: 200,
			data: {
				total_likes: result.total_likes || 0,
				total_dislikes: result.total_dislikes || 0,
			},
			message: message,
		};
	}

	// userning businesslarda birinchi bo'lib yozilgan review lar soni
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/self-user-all-first-reviews")
	public async getUserFirstBusinessReviews(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<unknown> {
		console.log("Salom");
		const userId = executerPayload.executer.id;
		// Har bir biznes uchun foydalanuvchining birinchi sharhlarini sanash
		const firstReviewCount = await this.reviewRepo
			.createQueryBuilder("review")
			.select("COUNT(DISTINCT review.business_id)", "firstReviewCount") // Har bir biznesga tegishli birinchi sharhlar sonini olish
			.where("review.user_id = :userId", { userId })
			.getRawOne();
		const message = responseByLang("get_one", lang);
		return {
			status_code: 200,
			data: { first_review_count: parseInt(firstReviewCount.firstReviewCount, 10) },
			message,
		};
	}

	// u user yozgan reviewlar sonini olish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/self-user-review-count")
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
		return { status_code: 200, data: { review_count: data }, message };
	}

	// userning businesslarda birinchi bo'lib yozilgan reviewlardagi barcha yig'ilgan like va dislike lari by user_id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-user-review-like-dislike/:userId")
	public async getUserReviewLikeDislike(
		@CurrentLanguage() lang: string,
		@Param("userId") userId: string, // userId params orqali qabul qilinadi
	): Promise<{
		status_code: number;
		data: { total_likes: number; total_dislikes: number };
		message: string;
	}> {
		// Til bo'yicha javobni olamiz
		const message = responseByLang("get_one", lang);

		// Like va Dislike summasini olamiz
		const result = await this.reviewRepo
			.createQueryBuilder("review")
			.select("SUM(review.like)", "total_likes")
			.addSelect("SUM(review.dislike)", "total_dislikes")
			.where("review.user_id = :userId", { userId })
			.andWhere("review.is_deleted = false")
			.getRawOne();

		// Ma'lumotlarni formatlash va qaytarish
		return {
			status_code: 200,
			data: {
				total_likes: result.total_likes || 0,
				total_dislikes: result.total_dislikes || 0,
			},
			message: message,
		};
	}

	// userning businesslarda birinchi bo'lib yozilgan review lar soni by user_id
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/get-user-all-first-reviews/:userId")
	public async getUserAllFirstBusinessReviews(
		@CurrentLanguage() lang: string,
		@Param("userId") userId: string, // userId params orqali qabul qilinadi
	): Promise<unknown> {
		// Har bir biznes uchun foydalanuvchining birinchi sharhlarini sanash
		const firstReviewCount = await this.reviewRepo
			.createQueryBuilder("review")
			.select("COUNT(DISTINCT review.business_id)", "firstReviewCount") // Har bir biznesga tegishli birinchi sharhlar sonini olish
			.where("review.user_id = :userId", { userId })
			.getRawOne();
		const message = responseByLang("get_one", lang);
		return {
			status_code: 200,
			data: { first_review_count: parseInt(firstReviewCount.firstReviewCount, 10) },
			message,
		};
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
		return {
			status_code: 200,
			data: { review_count: data },
			message,
		};
	}

	// user id orqali user yozgan reviewlarning aynan qaysi categorylarga tegishli ekanligini soni bilan chiqarib berish
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/user-reviews-distribution/:userId")
	public async getUserReviewsByCategory(
		@Param("userId") userId: string,
		@CurrentLanguage() lang: string,
	): Promise<{
		status_code: number;
		data: { category_name: string; review_count: number }[];
		message: string;
	}> {
		// Kategoriyalar bo'yicha user sharhlarini olish
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

		// Tilga mos xabarni olish
		const message = responseByLang("get_one", lang);

		// Natijalarni formatlash va qaytarish
		return {
			status_code: 200,
			data: userReviewsByCategory.map((item) => ({
				category_name: item.category_name,
				review_count: parseInt(item.review_count, 10),
			})),
			message: message,
		};
	}
}
