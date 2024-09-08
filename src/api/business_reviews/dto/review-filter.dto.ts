import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class ReviewFilterDto extends PaginationDto {
	@IsOptional()
	@IsString()
	@Type(() => String)
	username!: string;
}