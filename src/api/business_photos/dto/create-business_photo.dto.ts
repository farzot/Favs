import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PhotoType } from "../../../common/database/Enums";

export class CreateBusinessPhotoDto {
	@IsNotEmpty()
	@IsString()
	public image!: string;

	@IsNotEmpty()
	@IsOptional()
	@IsEnum(PhotoType)
	public type!: PhotoType;

	@IsNotEmpty()
	@IsString()
	public caption!: string;

	@IsNotEmpty()
	@IsString()
	public business!: string;
}
