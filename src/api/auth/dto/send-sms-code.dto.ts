import { IsNotEmpty, IsString } from "class-validator";

export class SendSMSCodeDto {
	@IsNotEmpty()
	@IsString()
	phone_number!: string;
}
