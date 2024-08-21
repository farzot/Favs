import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreatePromocodeDto {
	@IsNotEmpty()
	@IsString()
	public promocode!: string;

	@IsNotEmpty()
	@IsNumber()
	public percentage!: number;
}
