import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ObjDto } from "src/common/type";

class OrderItemDto {
	//product_id
	@IsNotEmpty()
	@IsString()
	public id!: string;

	@IsNotEmpty()
	@IsNumber()
	public amount!: number;
}

export class CreateOrderDto {
	@IsNotEmpty()
	@IsNumber()
	public total_price!: number;

	@IsNotEmpty()
	@IsNumber()
	public given_discount!: number;

	@IsString()
	@IsOptional()
	public promocode!: string;

	@IsNotEmpty()
	@IsNumber()
	public total_to_pay!: number;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public user_location!: ObjDto;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public user_credit_card!: ObjDto;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	public product!: OrderItemDto[];

	@Exclude()
	public check_number!: string; 
}
