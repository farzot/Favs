import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
	@IsNotEmpty()
	@IsString()
  @MaxLength(20)
	public username!: string;

	@IsNotEmpty()
	@IsString()
	public password!: string;
}
