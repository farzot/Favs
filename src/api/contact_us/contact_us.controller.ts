import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ContactUsService } from "./contact_us.service";
import { CreateContactUsDto } from "./dto/create-contact_us.dto";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { Roles } from "../../common/database/Enums";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { SendMsgFromBot } from "telegram-bot-sender";
import { config } from "../../config";

@Controller("/admin/contact-us")
export class ContactUsController {
	constructor(private readonly contactUsService: ContactUsService) {}

	@Post()
	create(@Body() dto: CreateContactUsDto, @CurrentLanguage() lang: string) {
		const result = this.contactUsService.create(dto, lang);
		let box = " ";
		if (dto.message) {
			box = dto.message;
		}
		SendMsgFromBot(
			config.BOT_TOKEN,
			config.CHAT_ID_CONTACT_US,
			[
				{ key: "Name", value: dto.name },
				{ key: "Phone", value: dto.phone },
				{ key: "Message", value: box },
			],
			// "title",
		);
		return result;
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	findAll(@CurrentLanguage() lang: string) {
		return this.contactUsService.findAll(lang, {
			order: {
				created_at: "DESC", // Oxirgi yaratilganlarini birinchi o'ringa qo'yadi
			},
		});
	}
}
