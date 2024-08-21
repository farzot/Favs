import { PartialType } from '@nestjs/mapped-types';
import { CreateUserLocationDto } from './create-user-location.dto';

export class UpdateUserLocationDto extends PartialType(CreateUserLocationDto) {}
