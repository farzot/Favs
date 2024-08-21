import { Module } from "@nestjs/common";
import { FollowersService } from "./followers.service";
import { FollowersController } from "./followers.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowersEntity } from "../../core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([FollowersEntity])],
	controllers: [FollowersController],
	providers: [FollowersService],
	exports: [FollowersService],
})
export class FollowersModule {}
