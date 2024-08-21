import { IsBooleanString, IsEnum, IsNumberString, IsOptional } from "class-validator";
import { FilterDto } from "src/common/dto/filter.dto";
import { ProductType } from "../../../common/database/Enums";

export class ProductQueryDto extends FilterDto {
	@IsOptional()
	@IsNumberString()
	category_id!: string;

    @IsOptional()
	@IsBooleanString()
	is_popular!: boolean;

    @IsOptional()
	@IsBooleanString()
	is_recomended!: boolean;
    
    @IsOptional()
    @IsEnum(ProductType)
    public type!: ProductType;
}
