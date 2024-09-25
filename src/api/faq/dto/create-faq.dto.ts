import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFaqDto {
	@IsNotEmpty()
	@IsString()
	question_uz!: string;

	@IsNotEmpty()
	@IsString()
	question_ru!: string;

	@IsNotEmpty()
	@IsString()
	question_en!: string;
	
	@IsNotEmpty()
	@IsString()
	answer_uz!: string;

	@IsNotEmpty()
	@IsString()
	answer_ru!: string;
	
	@IsNotEmpty()
	@IsString()
	answer_en!: string;
}

export class CreateBusinessFaqDto {
	@IsNotEmpty()
	@IsString()
	question_uz!: string;

	@IsNotEmpty()
	@IsString()
	question_ru!: string;

	@IsNotEmpty()
	@IsString()
	question_en!: string;

	@IsNotEmpty()
	@IsString()
	answer_uz!: string;

	@IsNotEmpty()
	@IsString()
	answer_ru!: string;

	@IsNotEmpty()
	@IsString()
	answer_en!: string;

	@IsOptional()
	public business!: string;
}