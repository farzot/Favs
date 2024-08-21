import { Module } from "@nestjs/common";
import { BusinessReviewsService } from "./business_reviews.service";
import { BusinessReviewsController } from "./business_reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessReviewEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([BusinessReviewEntity])],
	controllers: [BusinessReviewsController],
	providers: [BusinessReviewsService],
	exports: [BusinessReviewsService],
})
export class BusinessReviewsModule {}
