import { IsNotEmpty, IsString, Matches } from "class-validator";

export class SendSMSCodeDto {
	@IsNotEmpty()
	@IsString()
	@Matches(/^\+998\d{9}$/, {
		message: "Phone number must be a valid Uzbekistan number starting with +998",
	})
	phone_number!: string;
}
