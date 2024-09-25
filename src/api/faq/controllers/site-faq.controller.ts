import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { FaqService } from "../service/site-faq.service";
import { CreateFaqDto } from "../dto/create-faq.dto";
import { UpdateFaqDto } from "../dto/update-faq.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { JwtAuthGuard } from "../../auth/user/AuthGuard";
import { RolesGuard } from "../../auth/roles/RoleGuard";
import { Roles } from "../../../common/database/Enums";
import { RolesDecorator } from "../../auth/roles/RolesDecorator";

@Controller("/admin/faq")
export class FaqController {
	constructor(private readonly faqService: FaqService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	create(@Body() createFaqDto: CreateFaqDto, @CurrentLanguage() lang: string) {
		return this.faqService.create(createFaqDto, lang);
	}

	@Get("/all")
	async findAll(@CurrentLanguage() lang: string) {
		let { data: faqs } = await this.faqService.findAll(lang, { where: { is_deleted: false } });
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
		@Body() updateFaqDto: UpdateFaqDto,
		@CurrentLanguage() lang: string,
	) {
		await this.faqService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.faqService.update(id, updateFaqDto, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.BUSINESS_OWNER, Roles.BUSINESS_MANAGER)
	@Delete(":id")
	async remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		await this.faqService.findOneById(id, lang, { where: { is_deleted: false } });
		return this.faqService.delete(id, lang);
	}
}
