import { Module } from "@nestjs/common";
import { FaqService } from "./service/site-faq.service";
import { FaqController } from "./controllers/site-faq.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FaqEntity } from "src/core/entity/faq.entity";
import { FaqBusinessController } from "./controllers/business-faq.controller";
import { BusinessFaqService } from "./service/business-faq.service";
import { FaqBusinessEntity } from "../../core/entity/faq-business.entity";
import { ClientBusinessService } from "../business/service/client-business.service";
import { BusinessModule } from "../business/business.module";

@Module({
	imports: [TypeOrmModule.forFeature([FaqEntity, FaqBusinessEntity]),BusinessModule],
	controllers: [FaqController, FaqBusinessController],
	providers: [FaqService, BusinessFaqService],
})
export class FaqModule {}
