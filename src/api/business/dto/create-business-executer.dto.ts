import { Type } from "class-transformer";
import {
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
	@IsNotEmpty({ message: "first_name не должно быть пустым." })
	@IsString({ message: "first_name должно быть строкой." })
	first_name!: string;

	@IsNotEmpty({ message: "last_name не должно быть пустым." })
	@IsString({ message: "last_name должно быть строкой." })
	last_name!: string;

	@IsNotEmpty({ message: "gender не должен быть пустым." })
	@IsEnum(Gender, { message: "Некорректное значение для gender." })
	gender!: Gender;

	@IsOptional()
	// @IsNumber({}, { message: "birth_date должен быть числом." })
	birth_date!: number;

	@IsNotEmpty({ message: "phone_number не должен быть пустым." })
	@IsString({ message: "phone_number должно быть строкой." })
	@IsPhoneNumber({ message: "Некорректный номер телефона для phone_number." })
	phone_number!: string;

	@IsOptional()
	@ValidateNested({ each: true, message: "Поле image должно быть валидным объектом." })
	@Type(() => ObjDto)
	image!: ObjDto;

	@IsNotEmpty({ message: "username не должно быть пустым." })
	@IsString({ message: "username должно быть строкой." })
	username!: string;

	@IsNotEmpty({ message: "password не должно быть пустым." })
	@IsString({ message: "password должно быть строкой." })
	password!: string;
}

export class CreateExecuterDtoWithRole extends CreateExecuterDto {
	@IsNotEmpty({ message: "role не должен быть пустым." })
	@IsEnum(Roles, { message: "Некорректное значение для role." })
	role!: Roles;
}
