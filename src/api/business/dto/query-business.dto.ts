import { IsBooleanString, IsNumberString, IsOptional } from "class-validator";
import { FilterDto } from "src/common/dto/filter.dto";

export class BusinessQueryDto extends FilterDto {
	@IsOptional()
	@IsNumberString()
	category_id!: string;

	@IsOptional()
	@IsBooleanString()
	is_delivery_available!: boolean;

	@IsOptional()
	@IsBooleanString()
	is_reservation_available!: boolean;

	@IsOptional()
	@IsBooleanString()
	is_wifi_available!: boolean;

	@IsOptional()
	@IsBooleanString()
	is_claimed!: boolean;

	@IsOptional()
	@IsBooleanString()
	is_recommended!: boolean;

	@IsOptional()
	@IsBooleanString()
	open!: boolean;
}
