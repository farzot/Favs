import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExecuterEntity } from "src/core/entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtToken } from "src/infrastructure/lib/jwt-token";

@Module({
	imports: [TypeOrmModule.forFeature([ExecuterEntity]), JwtModule],
	controllers: [AdminController],
	providers: [AdminService, JwtToken],
	exports: [AdminService],
})
export class AdminModule {}
