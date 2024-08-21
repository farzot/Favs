import { Injectable } from "@nestjs/common";
import { CreateBigCategoryDto } from "./dto/create-big_category.dto";
import { UpdateBigCategoryDto } from "./dto/update-big_category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BigCategoryRepository } from "../../core/repository";
import { BigCategoryEntity } from "../../core/entity";
import { BaseService } from "../../infrastructure/lib/baseService";

@Injectable()
export class BigCategoryService extends BaseService<
	CreateBigCategoryDto,
	UpdateBigCategoryDto,
	BigCategoryEntity
> {
	constructor(@InjectRepository(BigCategoryEntity) repository: BigCategoryRepository) {
		super(repository, "BigCategory");
	}
}
