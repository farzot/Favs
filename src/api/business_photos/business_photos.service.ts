import { Injectable } from '@nestjs/common';
import { CreateBusinessPhotoDto } from './dto/create-business_photo.dto';
import { UpdateBusinessPhotoDto } from './dto/update-business_photo.dto';
import { BaseService } from '../../infrastructure/lib/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessPhotosEntity } from '../../core/entity';
import { BusinessPhotoRepository } from '../../core/repository';

@Injectable()
export class BusinessPhotosService extends BaseService<
	CreateBusinessPhotoDto,
	UpdateBusinessPhotoDto,
	BusinessPhotosEntity
> {
	constructor(@InjectRepository(BusinessPhotosEntity) repository: BusinessPhotoRepository) {
		super(repository, "BusinessPhotos");
	}
}
