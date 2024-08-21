import { Module, forwardRef } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "src/core/entity/product.entity";
import { SmallCategoryModule } from "../small_category/small_category.module";
import { SmallCategoryEntity } from "src/core/entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([ProductEntity, SmallCategoryEntity]),
		forwardRef(() => SmallCategoryModule),
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
