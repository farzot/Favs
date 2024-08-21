import {
	IsBoolean,
	IsBooleanString,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	Max,
} from "class-validator";
import { ProductType } from "../../../common/database/Enums";

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	public name_uz!: string;

	@IsNotEmpty()
	@IsString()
	public name_en!: string;

	@IsNotEmpty()
	@IsString()
	public name_ru!: string;

	@IsNotEmpty()
	@IsString()
	public description_uz!: string;

	@IsNotEmpty()
	@IsString()
	public description_en!: string;

	@IsNotEmpty()
	@IsString()
	public description_ru!: string;

	@IsNotEmpty()
	@IsOptional()
	@IsString()
	public sub_description_uz!: string;

	@IsNotEmpty()
	@IsOptional()
	@IsString()
	public sub_description_en!: string;

	@IsNotEmpty()
	@IsOptional()
	@IsString()
	public sub_description_ru!: string;

	@IsNotEmpty()
	@IsNumberString()
	public amount!: number;

	@IsNotEmpty()
	@IsNumberString()
	public price!: number;

	@IsOptional()
	@IsBoolean()
	public discount!: boolean;

	@IsOptional()
	@IsNumber()
	@Max(100)
	public discount_percent!: number;

	@IsOptional()
	@IsNumberString()
	public discount_price!: number;

	@IsOptional()
	@IsNumberString()
	public category!: string;

	@IsOptional()
	@IsBoolean()
	public is_recomended!: boolean;

	@IsOptional()
	@IsBoolean()
	public is_popular!: boolean;

	@IsNotEmpty()
	@IsEnum(ProductType)
	public type!: ProductType;
}
