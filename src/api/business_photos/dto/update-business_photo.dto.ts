import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessPhotoDto } from './create-business_photo.dto';

export class UpdateBusinessPhotoDto extends PartialType(CreateBusinessPhotoDto) {}
