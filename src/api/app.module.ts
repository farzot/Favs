import { TypeOrmModule } from "@nestjs/typeorm";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule";
import { CorrelatorMiddleware } from "../infrastructure/middleware/correlator";
import { config } from "src/config";
import { SmallCategoryModule } from "./small_category/small_category.module";
import { BannerModule } from "./banner/banner.module";
import { ProductModule } from "./product/product.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BasketModule } from "./basket/basket.module";
import { UserLocationModule } from "./user-location/user-location.module";
import { AdminModule } from "./admin/admin.module";
import { OrderModule } from "./order/order.module";
import { MailModule } from "./mail/mail.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { UserCreditCardModule } from "./user_credit_card/user_credit_card.module";
import { FileModule } from "./file/file.module";
import { NewsModule } from "./news/news.module";
import { FaqModule } from "./faq/faq.module";
import { ContactUsModule } from "./contact_us/contact_us.module";
import { PromocodeModule } from "./promocode/promocode.module";
import { BusinessModule } from "./business/business.module";
import { BigCategoryModule } from "./big_category/big_category.module";
import { BusinessPhotosModule } from "./business_photos/business_photos.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { FriendshipModule } from "./friendship/friendship.module";
import { CollectionsModule } from "./collections/collections.module";
import { MessagesModule } from "./messages/messages.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { BusinessReviewsModule } from "./business_reviews/business_reviews.module";
import { ProductReviewsModule } from "./product_reviews/product_reviews.module";
import { ChatGateway } from "../chat/chat.gateway";
// import { ChatModule } from "./chat/chat.module";
import { BlockModule } from "./block/block.module";
import { PaymentModule } from './payment/payment.module';
import { ReservationsService } from "./reservations/reservations.service";
import { NotificationsService } from "./notifications/notifications.service";
@Module({
	providers: [ChatGateway],
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres",
			url: config.DB_URL,
			entities: ["dist/core/entity/*.entity{.ts,.js}"],
			synchronize: true, // TODO: set to false in production
		}),
		NestScheduleModule.forRoot(),
		SmallCategoryModule,
		BannerModule,
		ProductModule,
		AuthModule,
		UserModule,
		BasketModule,
		UserLocationModule,
		AdminModule,
		OrderModule,
		MailModule,
		FeedbackModule,
		FileModule,
		NewsModule,
		UserCreditCardModule,
		FaqModule,
		ContactUsModule,
		PromocodeModule,
		BusinessModule,
		BigCategoryModule,
		BusinessPhotosModule,
		ReservationsModule,
		CollectionsModule,
		MessagesModule,
		NotificationsModule,
		BusinessReviewsModule,
		ProductReviewsModule,
		// ChatModule,
		FriendshipModule,
		BlockModule,
		PaymentModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorrelatorMiddleware).forRoutes("*");
	}
}
