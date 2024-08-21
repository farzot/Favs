import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BusinessReviewsService } from './business_reviews.service';
import { CreateBusinessReviewDto } from './dto/create-business_review.dto';
import { UpdateBusinessReviewDto } from './dto/update-business_review.dto';
import { CurrentLanguage } from '../../common/decorator/current-language';

@Controller("business-reviews")
export class BusinessReviewsController {
	constructor(private readonly businessReviewsService: BusinessReviewsService) {}

	@Post()
	create(@Body() dto: CreateBusinessReviewDto, @CurrentLanguage() lang: string) {
		return this.businessReviewsService.create(dto, lang);
	}

	@Get()
	async findAll(@CurrentLanguage() lang: string) {
		await this.businessReviewsService.findAll(lang, {
			where: { is_deleted: false },
		});
	}

	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.businessReviewsService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateBusinessReviewDto,
		@CurrentLanguage() lang: string,
	) {
		await this.businessReviewsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.businessReviewsService.update(id, dto, lang);
	}

	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.businessReviewsService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.businessReviewsService.delete(id, lang);
	}
}
