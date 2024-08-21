import { IsNotEmpty, IsString } from "class-validator";

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
}
