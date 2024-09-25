import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { CreateBusinessFaqDto, CreateFaqDto } from "../dto/create-faq.dto";
import { UpdateBusinessFaqDto, UpdateFaqDto } from "../dto/update-faq.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { BusinessFaqService } from "../service/business-faq.service";
import { RolesGuard } from "../../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../../auth/user/AuthGuard";
import { RolesDecorator } from "../../auth/roles/RolesDecorator";
import { Roles } from "../../../common/database/Enums";
import { CurrentExecuter } from "../../../common/decorator/current-user";
import { ICurrentExecuter } from "../../../common/interface/current-executer.interface";
import { ClientBusinessService } from "../../business/service/client-business.service";
import { BusinessNotFound } from "../../business/exception/not-found";
import { FaqBusinessEntity } from "../../../core/entity/faq-business.entity";
import { IResponse } from "../../../common/type";

@Controller("/business/faq")
export class FaqBusinessController {
	constructor(
		private readonly faqService: BusinessFaqService,
		private readonly businessService: ClientBusinessService,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Post()
	public async create(
		@Body() createFaqDto: CreateBusinessFaqDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		const business_id = executerPayload.executer.business[0]?.id;
		if (!business_id) {
			throw new BusinessNotFound();
		}
		await this.businessService.findOneById(business_id, lang, {
			where: { is_deleted: false },
		});
		createFaqDto.business = business_id;
		return this.faqService.create(createFaqDto, lang);
	}

	@Get("/all")
	async findAll(@CurrentLanguage() lang: string) {
		let { data: faqs } = await this.faqService.findAll(lang, { where: { is_deleted: false } });
		faqs = this.faqService.filterFaqByLang(faqs, lang);
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: faqs, message };
	}
	
	// get all by business_id
	@Get("/by-business/:business_id")
	async findByBusinessId(
		@CurrentLanguage() lang: string,
		@Param("business_id") business_id: string,
	): Promise<IResponse<FaqBusinessEntity[]>> {
		// FAQ'larni business_id orqali olish
		let { data: faqs } = await this.faqService.findAll(lang, {
			where: { is_deleted: false, business: { id: business_id } },
		});

		// Til bo'yicha FAQ'larni filtr qilish
		faqs = this.faqService.filterFaqByLang(faqs, lang);

		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: faqs, message };
	}

	@Get(":id")
	async findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		let { data: faq } = await this.faqService.findOneById(id, lang, {
			where: { is_deleted: false },
		});
		[faq] = this.faqService.filterFaqByLang([faq], lang);
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: faq, message };
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() updateFaqDto: UpdateBusinessFaqDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		let business_id = executerPayload.business_id;
		if (!business_id) {
			// Business mavjud bo'lmasa, xatolik qaytaramiz
			throw new BusinessNotFound();
		}
		updateFaqDto.business = business_id;
		await this.faqService.findOneBy(lang, {
			where: { is_deleted: false, id: id, business: { id: business_id } },
		});
		// await this.faqService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.faqService.update(id, updateFaqDto, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Delete(":id")
	async remove(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		let business_id = executerPayload.business_id;
		if (!business_id) {
			// Business mavjud bo'lmasa, xatolik qaytaramiz
			throw new BusinessNotFound();
		}
		await this.faqService.findOneBy(lang, {
			where: { is_deleted: false, id: id, business: { id: business_id } },
		});
		// await this.faqService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.faqService.delete(id, lang);
	}
}
