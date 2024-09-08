import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class ActivateUserDto {
	@IsNotEmpty()
    @IsUUID()
	public user_id!: string;

	@IsNotEmpty()
	@IsString()
	public otp!: string;
}
