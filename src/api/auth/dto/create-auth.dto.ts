import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
	password!: string;

	@IsNotEmpty()
	@IsString()
	confirm_password!: string;
}
