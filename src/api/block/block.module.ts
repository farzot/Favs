import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";
import { BlockEntity, ExecuterEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([BlockEntity, ExecuterEntity])],
	controllers: [BlockController],
	providers: [BlockService],
	exports: [BlockService],
})
export class BlockModule {}
