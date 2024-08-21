import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([FileEntity])],
	controllers: [FileController],
	providers: [FileService],
})
export class FileModule {}
