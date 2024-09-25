import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FaqEntity } from "src/core/entity/faq.entity";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateBusinessFaqDto } from "../dto/create-faq.dto";
import { UpdateBusinessFaqDto } from "../dto/update-faq.dto";
import { FaqBusinessEntity } from "../../../core/entity/faq-business.entity";
import { Repository } from "typeorm";

@Injectable()
export class BusinessFaqService extends BaseService<
	CreateBusinessFaqDto,
	UpdateBusinessFaqDto,
	FaqBusinessEntity
> {
	constructor(@InjectRepository(FaqBusinessEntity) repository: Repository<FaqBusinessEntity>) {
		super(repository, "business_faq");
	}
	public filterFaqByLang(faqs: FaqBusinessEntity[], lang: string) {
		return faqs.map((item) => {
			if (lang == "uz") {
				return { ...item, question: item.question_uz, answer: item.answer_uz };
			} else if (lang == "ru") {
				return { ...item, question: item.question_ru, answer: item.answer_ru };
			} else if (lang == "en") {
				return { ...item, question: item.question_en, answer: item.answer_en };
			} else {
				return { ...item, question: item.question_en, answer: item.answer_en };
			}
		});
	}
}
