import { IsNotEmpty, IsString } from "class-validator";

export class ImageProductDto {
	@IsNotEmpty()
	@IsString()
	image_name!: string;
}
