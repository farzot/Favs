import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { PaymentEntity } from "../../core/entity/payment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([PaymentEntity])],
	controllers: [PaymentController],
	providers: [PaymentService],
	exports: [PaymentService],
})
export class PaymentModule {}
