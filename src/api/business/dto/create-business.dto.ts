import {
	ArrayNotEmpty,
	IsArray,
	IsBoolean,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from "class-validator";
import { CreateExecuterDto } from "./create-business-executer.dto";
import { Type } from "class-transformer";
import { ObjDto } from "../../../common/type";
import { TopicType } from "../../../common/database/Enums";

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

export class CreateBusinessTelegramChatIdDto {
	@IsNotEmpty()
	@IsString()
	public chat_id!: string;

	@IsNotEmpty()
	@IsUUID()
	// @ValidateNested({ each: true })
	// @Type(() => ObjDto)
	public business!: string;
}

export class CreateTelegramChatIdDto {
	@IsNotEmpty()
	@IsString()
	public chat_id!: string;

	@IsOptional()
	@IsNotEmpty()
	@IsUUID()
	public business!: string;
}


export class CreateTelegramChatTopicIdDto {
	@IsNotEmpty()
	@IsString()
	public topic_id!: string;

	@IsOptional()
	@IsNotEmpty()
	@IsUUID()
	public chat_id!: string;

	@IsNotEmpty()
	@IsEnum(TopicType)
	public type!: TopicType;
}