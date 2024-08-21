import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	new_password!: string;
	
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	confirm_password!: string;
}
