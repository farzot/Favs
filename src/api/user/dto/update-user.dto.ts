import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { CreateExecuterDto } from '../../business/dto/create-business-executer.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateExecuterDto) {
	@IsOptional()
	@IsString()
	public home_town!: string;

    @IsOptional()
	@IsString()
	public phone_number!: string;

    @IsOptional()
	@IsString()
	public blog_or_website!: string;

    @IsOptional()
	@IsString()
	public second_favourite_website!: string;

    @IsOptional()
	@IsString()
	public my_favourite_book!: string;

    @IsOptional()
	@IsString()
	public primary_language!: string;
}
