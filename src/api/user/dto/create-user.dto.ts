import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsEnum,
	IsBoolean,
	IsArray,
} from "class-validator";
import { Gender } from "src/common/database/Enums";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	public first_name!: string;

	@IsNotEmpty()
	@IsString()
	public last_name!: string;

	@IsNotEmpty()
	@IsString()
	@IsOptional()
	public username?: string;

	@IsNotEmpty()
	@IsEmail()
	public email!: string;

	@IsOptional()
	@IsString()
	public password?: string;

	@IsOptional()
	@IsArray()
	public profile_picture?: string[];

	@IsOptional()
	@IsString()
	public phone_number?: string;

	@IsOptional()
	@IsEnum(Gender)
	public gender?: Gender;

	@IsOptional()
	@IsString()
	public home_town?: string;

	@IsOptional()
	public birth_date?: number;

	@IsOptional()
	@IsString()
	public my_blog_or_website?: string;

	@IsOptional()
	@IsString()
	public my_second_favourite_website?: string;

	@IsOptional()
	@IsString()
	public my_favourite_book?: string;

	@IsOptional()
	@IsString()
	public primary_language?: string;

	@IsOptional()
	@IsBoolean()
	public is_profile_private?: boolean;

	@IsOptional()
	@IsString()
	public hashed_token?: string;

	@IsOptional()
	@IsString()
	public google_id?: string;

	@IsOptional()
	@IsString()
	public otp?: string;

	@IsOptional()
	public otp_expiration?: Date;

	@IsOptional()
	public otp_request_count?: number;

	@IsOptional()
	public otp_blocked_until?: Date;

	@IsOptional()
	public otp_blocked_duration?: number;
}
