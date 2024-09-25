import { ArrayNotEmpty, IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateExecuterDto } from "./create-business-executer.dto";

export class CreateBusinessDto extends CreateExecuterDto {
	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsNotEmpty()
	@IsEmail()
	public email!: string;

	@IsNotEmpty()
	@IsString()
	public phone_number!: string;	

	@IsNotEmpty()
	@IsString()
	public website!: string;

	@IsNotEmpty()
	@IsString()
	public stir_number!: string;

	@IsNotEmpty()
	@IsString()
	public street_adress!: string;

	@IsNotEmpty()
	@IsString()
	public city!: string;

	@IsNotEmpty()
	@IsString()
	public state!: string;

	@IsNotEmpty()
	@IsString()
	public zip_code!: string;

	@IsNotEmpty()
	@IsNumberString()
	public latitude!: number;

	@IsNotEmpty()
	@IsNumberString()
	public longitude!: number;

	// @IsNotEmpty()
	// @IsArray()
	// @ArrayNotEmpty()
	// @IsString({ each: true })
	// public categories!: string[];

	@IsNotEmpty()
	@IsArray()
	@IsUUID("4", { each: true })
	public categories!: string[];

	@IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	public is_claimed!: boolean;
}
