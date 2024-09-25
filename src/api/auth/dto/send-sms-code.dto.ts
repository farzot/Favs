import { IsNotEmpty, IsString, Matches, Length } from "class-validator";

export class SendSMSCodeDto {
	@IsNotEmpty()
	@IsString()
	@Matches(/^\+998\d{9}$/, {
		message: "Phone number must be a valid Uzbekistan number starting with +998",
	})
	@Length(13, 13, {
		message: "Phone number must be exactly 13 characters long, including the country code",
	})
	phone_number!: string;
}
