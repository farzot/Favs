import { IsArray, IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AddBusinessRequestDto {
	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsNotEmpty()
	@IsEmail()
	public email!: string;

	@IsNotEmpty()
	@IsString()
	public phone_number!: string;

	@IsNotEmpty()
	@IsString()
	public website!: string;

	@IsNotEmpty()
	@IsArray()
	@IsUUID("4", { each: true })
	public categories!: string[];

	@IsNotEmpty()
	@IsString()
	public street_adress!: string;

	@IsNotEmpty()
	@IsString()
	public city!: string;

	@IsNotEmpty()
	@IsString()
	public state!: string;

	@IsNotEmpty()
	@IsString()
	public zip_code!: string;
}
