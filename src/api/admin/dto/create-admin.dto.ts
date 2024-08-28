import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
	@IsNotEmpty()
	@IsString()
	public first_name!: string;

	@IsNotEmpty()
	@IsString()
	public last_name!: string;

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

	@IsNotEmpty()
	@IsString()
	public role!: string;
}
