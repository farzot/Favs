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
	public filterCategoryByLang(faqs: BigCategoryEntity[], lang: string) {
		return faqs.map((item) => {
			if (lang == "uz") {
				return { ...item, name: item.name_uz };
			} else if (lang == "ru") {
				return { ...item, name: item.name_ru };
			} else if (lang == "en") {
				return { ...item, name: item.name_en };
			} else {
				return { ...item, name: item.name_en };
			}
		});
	}
}
