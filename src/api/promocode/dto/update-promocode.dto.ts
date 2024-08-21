import { PartialType } from '@nestjs/mapped-types';
import { CreatePromocodeDto } from './create-promocode.dto';
import { IsBoolean } from 'class-validator';

export class UpdatePromocodeDto extends PartialType(CreatePromocodeDto) {
    @IsBoolean()
    public is_active!:boolean
}
