import { Module } from "@nestjs/common";
import { BusinessPhotosService } from "./business_photos.service";
import { BusinessPhotosController } from "./business_photos.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessPhotosEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([BusinessPhotosEntity])],
	controllers: [BusinessPhotosController],
	providers: [BusinessPhotosService],
	exports: [BusinessPhotosService],
})
export class BusinessPhotosModule {}
