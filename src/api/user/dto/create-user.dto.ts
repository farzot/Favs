import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	readonly first_name!: string;

	@IsOptional()
	@IsString()
	readonly last_name!: string;

	@IsNotEmpty()
	@IsString()
	readonly email!: string;

	@IsNotEmpty()
	@IsString()
	public password!: string;
}
