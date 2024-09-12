import { IsNotEmpty, IsString } from "class-validator";

export class VerifySMSCodeDto {
	@IsNotEmpty()
	@IsString()
	phone_number!: string;

	@IsNotEmpty()
	@IsString()
	otp!: string;
}
