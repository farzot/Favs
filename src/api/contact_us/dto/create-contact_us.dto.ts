import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateContactUsDto {
	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsNotEmpty()
	@IsString()
	phone!: string;

	@IsOptional()
	@IsNotEmpty()
	message!: string;
}
