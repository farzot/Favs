import { Module, forwardRef } from "@nestjs/common";
import { SmallCategoryEntity } from "src/core/entity/small-category.entity";
import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmallCategoryController } from "./small_category.controller";
import { SmallCategoryService } from "./small_category.service";

@Module({
	imports: [TypeOrmModule.forFeature([SmallCategoryEntity]), forwardRef(() => ProductModule)],
	controllers: [SmallCategoryController],
	providers: [SmallCategoryService],
	exports: [SmallCategoryService],
})
export class SmallCategoryModule {}
