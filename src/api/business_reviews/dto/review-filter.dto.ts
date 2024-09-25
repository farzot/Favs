import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, IsNumber } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class ReviewFilterDto extends PaginationDto {
	@IsOptional()
	@IsString()
	@Type(() => String)
	username!: string;

	@IsOptional()
	@IsString()
	business_id!: string;

	// Minimum rating uchun filter
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	min_rating!: number;

	// Maksimum rating uchun filter
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	max_rating!: number;
}
