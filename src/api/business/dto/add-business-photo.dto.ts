import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";
import { Type } from "class-transformer";

export class AddBusinessPhotoDto {
	// @IsOptional()
	// @IsString()
	// caption!: string;

	// @IsNotEmpty()
	// @ValidateNested({ each: true })
	// @Type(() => ObjDto)
	// public business!: ObjDto;

	@IsUUID()
	@IsNotEmpty()
	public readonly business!: { id: string }; // Business ID UUID formatida bo'lishi kerak

	@IsString()
	@IsNotEmpty()
	public readonly caption!: string; // Har bir surat uchun rasm tavsifi
}
