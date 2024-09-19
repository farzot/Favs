import { Type } from "class-transformer";
import { IsBooleanString, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { FilterDto } from "src/common/dto/filter.dto";

export class LocationBusinessQueryDto extends FilterDto {
	// @IsOptional()
	// @IsString()
	// country!: string;

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
	radius!: number; // Radius (kilometrda)
}
