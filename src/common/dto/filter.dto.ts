import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationDto } from "./pagination.dto";

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsString()
	@Type(() => String)
	search!: string;
}
