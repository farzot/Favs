import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { PhotoType } from "../../../common/database/Enums";

export class UpdateBusinessPhotoTypeDto {
	@IsNotEmpty()
	@IsUUID()
	public photo_id!: string;

	@IsNotEmpty()
	@IsEnum(PhotoType)
	public photo_type!: PhotoType;
}
