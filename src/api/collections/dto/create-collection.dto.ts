import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";

export class CreateCollectionDto {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public business!: ObjDto;

	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsOptional()
	@IsBoolean()
	public is_private!: boolean;
}
