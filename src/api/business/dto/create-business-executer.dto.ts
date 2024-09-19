import { Type } from "class-transformer";
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { Gender, Roles } from "src/common/database/Enums";
import { IsPhoneNumber } from "src/common/decorator/is-phone-number";
import { ObjDto } from "src/common/type";

export class CreateExecuterDto {
	@IsNotEmpty()
	@IsString()
	first_name!: string;

	@IsNotEmpty()
	@IsString()
	last_name!: string;

	@IsNotEmpty()
	@IsEnum(Gender)
	gender!: Gender;

	@IsOptional()
	// @IsNumber({}, { message: "birth_date должен быть числом." })
	birth_date!: number;

	@IsNotEmpty()
	@IsString()
	@IsPhoneNumber()
	phone_number!: string;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	image!: ObjDto;

	@IsNotEmpty()
	@IsString()
	username!: string;

	@IsNotEmpty()
	@IsString()
	password!: string;

	@IsNotEmpty()
    @IsEmail()
    executer_email!: string;
}

export class CreateExecuterDtoWithRole extends CreateExecuterDto {
	@IsNotEmpty()
	@IsEnum(Roles)
	role!: Roles;
}
