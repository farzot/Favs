import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";

export class CreateNewsDto {

	@IsNotEmpty()
	@IsString()
	public title_uz!: string;
	
    @IsNotEmpty()
	@IsString()
	public title_en!: string;

	@IsNotEmpty()
	@IsString()
	public title_ru!: string;

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
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ObjDto)
    files!: ObjDto[];

}
