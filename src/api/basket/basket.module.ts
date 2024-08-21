import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BasketEntity } from "src/core/entity";
import { ProductModule } from "../product/product.module";

@Module({
	imports: [TypeOrmModule.forFeature([BasketEntity]), ProductModule],
	controllers: [BasketController],
	providers: [BasketService],
	exports: [BasketService],
})
export class BasketModule {}
