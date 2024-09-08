import { ArrayNotEmpty, IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
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
	@IsString()
	public latitude!: string;

	@IsNotEmpty()
	@IsString()
	public longitude!: string;

	@IsNotEmpty()
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	public categories!: string[];

	@IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	public is_claimed!: boolean;
}
