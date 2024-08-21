import { Module } from '@nestjs/common';
import { ProductReviewsService } from './product_reviews.service';
import { ProductReviewsController } from './product_reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports:[TypeOrmModule.forFeature([ProductQueryDto])]
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService],
})
export class ProductReviewsModule {}
