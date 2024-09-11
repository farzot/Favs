import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";
import { Type } from "class-transformer";

export class CreateConsultationDto {
	@IsNotEmpty()
	@IsString()
	full_name!: string;

	@IsNotEmpty()
	@IsString()
	phone!: string;

    @IsOptional()
    @IsString()
	comment!: string;

	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public business!: ObjDto;
}