import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, ValidateIf, ValidateNested } from "class-validator";
import { ObjDto } from "../../../common/type";
import { Type } from "class-transformer";

export class CreateUserCreditCardDto {
	@IsNotEmpty()
	@IsString()
	@Length(13, 19)
	public card_number!: string;

	@IsNotEmpty()
	@IsString()
	@Length(2)
	@Matches(/^(0[1-9]|1[0-2])$/, {
		message: "expire_month must be a valid month (01-12)",
	})
	public expire_month!: string;

	@IsNotEmpty()
	@IsString()
	@Length(2)
	@Matches(/^(0[1-9]|[1-9][0-9])$/, {
		message: "Amal qilish yili 01 va 99 orasida bo'lishi kerak",
	})
	public expire_year!: string;

	@ValidateIf((o) => o.is_visa)
	@IsNotEmpty({ message: "cvv is required for VISA cards" })
	@IsString()
	@Matches(/^[0-9]{3}$/, { message: "CVV must be a 3-digit number between 001 and 999" })
	public cvv!: string;

	@IsNotEmpty()
	@IsOptional()
	@IsBoolean()
	public is_visa!: boolean;

	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public user_id!: ObjDto;
}
