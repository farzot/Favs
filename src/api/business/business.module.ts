import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessEntity } from "../../core/entity";
import { SmallCategoryModule } from "../small_category/small_category.module";
import { AdminController } from "../admin/admin.controller";
import { ClientBusinessController } from "./controller/client-business.controller";
import { AdminBusinessController } from "./controller/admin-business.controller";
import { AdminBusinessService } from "./service/admin-business.service";
import { ClientBusinessService } from "./service/client-business.service";

@Module({
	imports: [TypeOrmModule.forFeature([BusinessEntity]), SmallCategoryModule],
	controllers: [AdminBusinessController, ClientBusinessController],
	providers: [AdminBusinessService, ClientBusinessService],
	exports: [AdminBusinessService, ClientBusinessService],
})
export class BusinessModule {}
