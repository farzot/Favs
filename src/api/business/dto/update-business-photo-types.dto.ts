import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { PhotoType } from "../../../common/database/Enums";

export class UpdateBusinessPhotoTypesDto {
	@IsNotEmpty()
	@IsUUID("all", { each: true }) // Massivdagi har bir element UUID bo'lishi kerak
	public photo_ids!: string[];

	@IsNotEmpty()
	@IsEnum(PhotoType)
	public photo_type!: PhotoType;
}
