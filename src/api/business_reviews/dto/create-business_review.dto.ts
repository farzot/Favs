import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateBusinessReviewDto {
	@IsNotEmpty()
	@IsString()
	public text!: string;

	@IsNotEmpty()
	@IsNumberString()
	public rating!: number;

	@IsNotEmpty()
	public business!: string;
}
