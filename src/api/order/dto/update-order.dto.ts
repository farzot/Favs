import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjDto } from 'src/common/type';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
	// @IsOptional()
	// @IsNumber()
	// public total_price!: number;

	// @IsOptional()
	// @IsString()
	// public description!: string;

	// @IsOptional()
	// @ValidateNested({ each: true })
	// @Type(() => ObjDto)
	// public user_location!: ObjDto;
}
