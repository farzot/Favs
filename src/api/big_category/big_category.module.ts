import { Module } from "@nestjs/common";
import { BigCategoryService } from "./big_category.service";
import { BigCategoryController } from "./big_category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BigCategoryEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([BigCategoryEntity])],
	controllers: [BigCategoryController],
	providers: [BigCategoryService],
	exports: [BigCategoryService],
})
export class BigCategoryModule {}
