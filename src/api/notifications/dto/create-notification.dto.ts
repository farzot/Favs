import { IsBoolean, IsNotEmpty, IsString, isString } from "class-validator";

export class CreateNotificationDto {
	@IsNotEmpty()
	@IsString()
	public message!: string;

	@IsNotEmpty()
	@IsString()
	public user!: string;
}
