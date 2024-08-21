import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
	@IsNotEmpty()
	@IsString()
	public fullname!: string;

	@IsNotEmpty()
	@IsString()
	public username!: string;

	@IsNotEmpty()
	@IsEmail()
	public email!: string;

	@IsNotEmpty()
	@IsString()
	public phone_number!: string;

	@IsNotEmpty()
	@IsString()
	public password!: string;
}
