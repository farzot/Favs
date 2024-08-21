import { Module } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BannerEntity } from "src/core/entity/banner.entity";

@Module({
	imports: [TypeOrmModule.forFeature([BannerEntity])],
	controllers: [BannerController],
	providers: [BannerService],
})
export class BannerModule {}
