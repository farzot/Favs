import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";

export class CreateCollectionDto {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public user!: ObjDto;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public business!: ObjDto;
}
