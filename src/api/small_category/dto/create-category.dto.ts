import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";

export class CreateSmallCategoryDto {
	@IsNotEmpty()
	@IsString()
	public name_uz!: string;

	@IsNotEmpty()
	@IsString()
	public name_ru!: string;

	@IsNotEmpty()
	@IsString()
	public name_en!: string;

	@IsNotEmpty()
	@IsString()
	public description_uz!: string;

	@IsNotEmpty()
	@IsString()
	public description_en!: string;

	@IsNotEmpty()
	@IsString()
	public description_ru!: string;

	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public big_category!: ObjDto;
}
