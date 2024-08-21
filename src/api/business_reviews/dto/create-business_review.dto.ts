import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBusinessReviewDto {
	@IsNotEmpty()
	@IsString()
	public text!: string;

	@IsNotEmpty()
	@IsNumber()
	public rating!: number;

	@IsNotEmpty()
	public business!: string;

	@IsNotEmpty()
	public user!: string;
}
