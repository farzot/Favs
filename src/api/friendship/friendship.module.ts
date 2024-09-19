import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendshipController } from "./friendship.controller";
import { FriendshipService } from "./friendship.service";
import { FriendshipEntity } from "../../core/entity/friendship.entity";
import { ExecuterEntity } from "../../core/entity";
import { UserModule } from "../user/user.module";

@Module({
	imports: [TypeOrmModule.forFeature([FriendshipEntity, ExecuterEntity]),UserModule],
	controllers: [FriendshipController],
	providers: [FriendshipService],
	exports: [FriendshipService],
})
export class FriendshipModule {}
