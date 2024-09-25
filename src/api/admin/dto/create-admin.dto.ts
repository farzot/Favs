import { IsEmail, IsNotEmpty, IsString, Matches, Length } from "class-validator";

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
	@Matches(/^\+998[0-9]{9}$/, {
		message: "Phone number must be a valid Uzbekistan phone number starting with +998",
	})
	@Length(13, 13, {
		message: "Phone number must be exactly 13 characters long, including the country code",
	})
	public phone_number!: string;

	@IsNotEmpty()
	@IsString()
	public password!: string;

	@IsNotEmpty()
	@IsString()
	public role!: string;
}
