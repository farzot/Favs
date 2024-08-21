import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactUsEntity } from "src/core/entity";
import { ContactUsController } from "./contact_us.controller";
import { ContactUsService } from "./contact_us.service";

@Module({
	imports: [TypeOrmModule.forFeature([ContactUsEntity])],
	controllers: [ContactUsController],
	providers: [ContactUsService],
	exports: [ContactUsService],
})
export class ContactUsModule {}
