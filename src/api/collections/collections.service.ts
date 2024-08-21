import { Injectable } from "@nestjs/common";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CollectionsEntity } from "../../core/entity";
import { CollectionsRepository } from "../../core/repository";
import { BaseService } from "../../infrastructure/lib/baseService";

@Injectable()
export class CollectionsService extends BaseService<
	CreateCollectionDto,
	UpdateCollectionDto,
	CollectionsEntity
> {
	constructor(@InjectRepository(CollectionsEntity) repository: CollectionsRepository) {
		super(repository, "Collections");
	}
}
