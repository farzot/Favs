import { forwardRef, Module } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../user/user.module";
import { MulterModule } from "@nestjs/platform-express";
import { FeedbackEntity } from "../../core/entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forFeature([FeedbackEntity]),
		MulterModule,
		forwardRef(() => ProductModule),
		forwardRef(() => UserModule),
	],
	exports: [FeedbackService],
	controllers: [FeedbackController],
	providers: [FeedbackService],
})
export class FeedbackModule {}
