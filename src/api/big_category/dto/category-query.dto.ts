import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ProductType } from "src/common/database/Enums";
import { FilterDto } from "src/common/dto/filter.dto";

export class CategoryQueryDto extends FilterDto {
	@IsOptional()
	@IsString()
	public name_uz!: string;

	@IsOptional()
	@IsString()
	public name_ru!: string;

	@IsOptional()
	@IsString()
	public name_en!: string;
}
