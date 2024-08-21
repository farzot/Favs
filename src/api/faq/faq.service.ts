import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FaqEntity } from "src/core/entity/faq.entity";
import { FaqRepository } from "src/core/repository/faq.repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";

@Injectable()
export class FaqService extends BaseService<CreateFaqDto, UpdateFaqDto, FaqEntity> {
	constructor(@InjectRepository(FaqEntity) repository: FaqRepository) {
		super(repository, "Faq");
	}
	public filterFaqByLang(faqs: FaqEntity[], lang: string) {
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
