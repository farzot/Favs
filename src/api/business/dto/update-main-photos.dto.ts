import { IsArray, IsUUID, ArrayMaxSize } from "class-validator";

export class UpdateBusinessMainImagesDto {
	@IsArray()
	@IsUUID("all", { each: true }) // Har bir element UUID bo'lishi kerak
	@ArrayMaxSize(8) // Limit to 8 images
	public readonly photo_ids!: string[];
}
