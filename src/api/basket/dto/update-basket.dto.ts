import { PartialType } from '@nestjs/mapped-types';
import { CreateBasketDto } from './create-basket.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBasketDto extends PartialType(CreateBasketDto) {
  @IsNotEmpty()
  @IsNumber()
  amount!: number
}
