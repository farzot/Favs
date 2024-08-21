import { Injectable } from '@nestjs/common';
import { CreateProductReviewDto } from './dto/create-product_review.dto';
import { UpdateProductReviewDto } from './dto/update-product_review.dto';

@Injectable()
export class ProductReviewsService {
  create(createProductReviewDto: CreateProductReviewDto) {
    return 'This action adds a new productReview';
  }

  findAll() {
    return `This action returns all productReviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productReview`;
  }

  update(id: number, updateProductReviewDto: UpdateProductReviewDto) {
    return `This action updates a #${id} productReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReview`;
  }
}
