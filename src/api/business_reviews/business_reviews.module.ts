import { Module } from "@nestjs/common";
import { BusinessReviewsService } from "./business_reviews.service";
import { BusinessReviewsController } from "./business_reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessReviewEntity } from "../../core/entity";
import { BusinessModule } from "../business/business.module";
import { UserModule } from "../user/user.module";

@Module({
	imports: [TypeOrmModule.forFeature([BusinessReviewEntity]), BusinessModule, UserModule],
	controllers: [BusinessReviewsController],
	providers: [BusinessReviewsService],
	exports: [BusinessReviewsService],
})
export class BusinessReviewsModule {}
