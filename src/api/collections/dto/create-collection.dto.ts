import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";

export class CreateCollectionDto {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public business!: ObjDto;

	@IsNotEmpty()
	@IsString()
	public name!: string;
}
