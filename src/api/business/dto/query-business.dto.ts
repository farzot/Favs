import { IsBooleanString, IsEnum, IsNumberString, IsOptional } from "class-validator";
import { FilterDto } from "src/common/dto/filter.dto";
import { ProductType } from "../../../common/database/Enums";

export class BusinessQueryDto extends FilterDto {
	@IsOptional()
	@IsNumberString()
	category_id!: string;
}
