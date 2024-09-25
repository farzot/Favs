import { Type } from "class-transformer";
import { IsBooleanString, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { FilterDto } from "src/common/dto/filter.dto";

export class CombinedBusinessQueryDto extends FilterDto {
	// Search
	@IsOptional()
	@IsString()
	search!: string;

	// Category ID
	@IsOptional()
	@IsNumberString()
	category_id!: string;

	// Filtrlashlar
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

	// Location (city, state, coordinates, radius)
	@IsOptional()
	@IsString()
	city!: string;

	@IsOptional()
	@IsString()
	state!: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	latitude!: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	longitude!: number;

	@IsOptional()
	@IsNumberString()
	radius!: number;
}
