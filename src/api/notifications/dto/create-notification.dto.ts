import { IsBoolean, IsNotEmpty, IsString, isString, IsUUID } from "class-validator";

export class CreateNotificationDto {
	@IsNotEmpty()
	@IsString()
	public message!: string;

	@IsNotEmpty()
	@IsString()
	public title!: string;

	@IsNotEmpty()
	@IsUUID()
	public user!: string;
}
