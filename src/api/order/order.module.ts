import { forwardRef, Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
	OrderEntity,
	OrderItemEntity,
	UserCreditCardEntity,
	UserLocationEntity,
} from "src/core/entity";
import { ProductModule } from "../product/product.module";
import { BasketModule } from "../basket/basket.module";
import { UserCreditCardModule } from "../user_credit_card/user_credit_card.module";
import { UserLocationModule } from "../user-location/user-location.module";
import { PromocodeModule } from "../promocode/promocode.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			OrderEntity,
			OrderItemEntity,
			UserCreditCardEntity,
			UserLocationEntity,
		]),
		forwardRef(() => ProductModule),
		forwardRef(() => BasketModule),
		forwardRef(() => PromocodeModule),

	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
