import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessEntity } from "../../core/entity";
import { SmallCategoryModule } from "../small_category/small_category.module";
import { AdminController } from "../admin/admin.controller";
import { ClientBusinessController } from "./controller/client-business.controller";
import { AdminBusinessController } from "./controller/admin-business.controller";
import { AdminBusinessService } from "./service/admin-business.service";
import { ClientBusinessService } from "./service/client-business.service";
import { BigCategoryModule } from "../big_category/big_category.module";
import { ConsultationRequestEntity } from "../../core/entity/consultation.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([BusinessEntity, ConsultationRequestEntity]),
		forwardRef(() => SmallCategoryModule),
		forwardRef(() => BigCategoryModule),
	],
	controllers: [AdminBusinessController, ClientBusinessController],
	providers: [AdminBusinessService, ClientBusinessService],
	exports: [AdminBusinessService, ClientBusinessService],
})
export class BusinessModule {}
