import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAuthDto {
	@IsNotEmpty()
	@IsString()
	first_name!: string;

	@IsNotEmpty()
	@IsString()
	last_name!: string;

	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	password!: string;
}
