import { Injectable } from "@nestjs/common";
import { CreateBusinessReviewDto } from "./dto/create-business_review.dto";
import { UpdateBusinessReviewDto } from "./dto/update-business_review.dto";
import { BaseService } from "../../infrastructure/lib/baseService";
import { BusinessReviewEntity } from "../../core/entity";
import { BusinessReviewRepository } from "../../core/repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BusinessReviewsService extends BaseService<
	CreateBusinessReviewDto,
	UpdateBusinessReviewDto,
	BusinessReviewEntity
> {
	constructor(@InjectRepository(BusinessReviewEntity) repository: BusinessReviewRepository) {
		super(repository, "BusinessReview");
	}
}
