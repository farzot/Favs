import { Module } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CollectionsController } from "./collections.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionsEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([CollectionsEntity])],
	controllers: [CollectionsController],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
