import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ActivateUserDto {
	@IsNotEmpty()
    @IsNumber()
	public user_id!: string;

	@IsNotEmpty()
	@IsString()
	public otp!: string;
}
