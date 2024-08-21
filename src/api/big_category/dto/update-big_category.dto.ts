import { PartialType } from '@nestjs/mapped-types';
import { CreateBigCategoryDto } from './create-big_category.dto';

export class UpdateBigCategoryDto extends PartialType(CreateBigCategoryDto) {}
