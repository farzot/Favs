import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackEntity, UserEntity } from "../../core/entity";
import { BaseService } from "../../infrastructure/lib/baseService";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "../product/product.service";
import { UserService } from "../user/user.service";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "../../common/type";
import { FindOptionsWhereProperty } from "typeorm";
import { ProductNotFound } from "../order/exception/product-not-found";
import { Forbidden, InvalidToken, UserNotFound } from "../auth/exception";
import { FeedbackNotFound } from "./exception/feedback-not-found";
import { FeedbackRepository } from "../../core/repository";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { createFile, deleteFile } from "src/infrastructure/lib/fileService";

@Injectable()
export class FeedbackService extends BaseService<
	CreateFeedbackDto,
	UpdateFeedbackDto,
	FeedbackEntity
> {
	constructor(
		@InjectRepository(FeedbackEntity) private readonly feedbackRepo: FeedbackRepository,
		@Inject(forwardRef(() => ProductService))
		private productService: ProductService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
	) {
		super(feedbackRepo, "feedback");
	}

	async createFeedback(dto: CreateFeedbackDto, files: any, user: UserEntity, lang: string) {
		const new_feedback = new FeedbackEntity();
		new_feedback.user = user;
		const { data: check_product } = await this.productService.findOneById(dto.product, lang, {
			where: { is_deleted: false },
		});
		if (files.images) {
			let uploaded_files: string[] = [];
			files.images.map(async (image: any) => {
				const uploaded_file_name = await createFile(image);
				uploaded_files.push(uploaded_file_name);
			});
			new_feedback.images = uploaded_files;
		}
		new_feedback.product = check_product;
		new_feedback.text = dto.text;
		new_feedback.rate = dto.rate;
		new_feedback.created_at = Date.now();
		await this.feedbackRepo.save(new_feedback);
		const message = responseByLang("create", lang);
		return { status_code: 201, message, data: {} };
	}

	async updateFeedback(
		id: string,
		dto: UpdateFeedbackDto,
		files: any,
		user: UserEntity,
		lang: string,
	): Promise<IResponse<FeedbackEntity>> {
		try {
			console.log(files);

			const { data: feedback } = await this.findOneById(id, lang, {
				relations: { product: true, user: true },
				where: { is_deleted: false },
			});

			if (user.id !== feedback.user.id) {
				throw new Forbidden();
			}

			// const new_feedback = new FeedbackEntity();
			// new_feedback.user = user;

			if (files.images) {
				let uploaded_files: string[] = [];
				files.images.map(async (image: any) => {
					const uploaded_file_name = await createFile(image);
					uploaded_files.push(uploaded_file_name);
				});
				if (feedback.images) {
					feedback.images.forEach(async (file_name) => {
						await deleteFile(file_name);
					});
				}
				//feedback.images overwritten because only one image allowed if count of images increse this logic should be change
				feedback.images = uploaded_files;
			}

			feedback.text = dto.text || feedback.text;
			feedback.rate = dto.rate || feedback.rate;
			feedback.updated_at = Date.now();
			await this.getRepository.save(feedback);

			const message = responseByLang("update", lang);
			return { status_code: 200, data: feedback, message };
		} catch (err) {
			throw err;
		}
	}

	async deleteFeedback(id: string, user: UserEntity, lang: string) {
		try {
			const { data: feedback } = await this.findOneById(id, lang, {
				relations: { product: true, user: true },
				where: { is_deleted: false },
			});

			if (user.id !== feedback.user.id) {
				throw new Forbidden();
			}

			await this.delete(id, lang);

			const message = responseByLang("delete", lang);
			return { status_code: 200, message, data: [] };
		} catch (err) {
			throw err;
		}
	}

	async getAverageRate(product_id: string, lang: string) {
		try {
			const { data: product } = await this.productService.findOneById(product_id, lang);

			let rounded_rate = 0;
			const feedbacks = await this.getRepository.find({
				where: { product: { id: product_id }, is_deleted: false },
			});

			if (feedbacks.length > 0) {
				const rates = feedbacks.map((f) => f.rate);
				const average = rates.reduce((a, b) => a + b, 0) / rates.length;
				rounded_rate = parseFloat(average.toFixed(1)); // 1 xonaga yaxlitlash
			}

			const message = responseByLang("get_all", lang);
			return { status_code: 200, data: { rate: rounded_rate }, message };
		} catch (err) {
			throw err;
		}
	}
}
