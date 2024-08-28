import { Exclude } from "class-transformer";
import {
	IsBoolean,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsPhoneNumber,
	IsString,
} from "class-validator";

export class CreateUserLocationDto {

    @IsString()
	public name_of_address?: string;

	@IsNotEmpty()
	@IsString()
	public country!: string;

	@IsNotEmpty()
	@IsString()
	public city!: string;

	@IsNotEmpty()
	@IsString()
	public street!: string;

    @IsNotEmpty()
	@IsPhoneNumber()
	public phone_number!: string;

	@IsNotEmpty()
	@IsNumberString()
	public zip_code!: string;

    @IsOptional()
	@IsBoolean()
	public is_main!: boolean;

}
