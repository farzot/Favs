import { PartialType } from '@nestjs/mapped-types';
import { CreateExecuterDto } from '../../business/dto/create-business-executer.dto';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	// @IsOptional()
	// @IsString()
	// public home_town!: string;

    // @IsOptional()
	// @IsString()
	// public phone_number!: string;

    // @IsOptional()
	// @IsString()
	// public blog_or_website!: string;

    // @IsOptional()
	// @IsString()
	// public second_favourite_website!: string;

    // @IsOptional()
	// @IsString()
	// public my_favourite_book!: string;

    // @IsOptional()
	// @IsString()
	// public primary_language!: string;
}
