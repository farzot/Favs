import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessReviewDto } from './create-business_review.dto';

export class UpdateBusinessReviewDto extends PartialType(CreateBusinessReviewDto) {}
