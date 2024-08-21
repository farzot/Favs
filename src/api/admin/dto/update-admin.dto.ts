import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { Roles } from 'src/common/database/Enums';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
	@IsOptional()
	@IsEnum([Roles.SUPER_ADMIN, Roles.ADMIN])
	public role!: [Roles.SUPER_ADMIN, Roles.ADMIN];
}
