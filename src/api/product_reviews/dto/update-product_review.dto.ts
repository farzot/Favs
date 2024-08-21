import { PartialType } from '@nestjs/mapped-types';
import { CreateProductReviewDto } from './create-product_review.dto';

export class UpdateProductReviewDto extends PartialType(CreateProductReviewDto) {}
