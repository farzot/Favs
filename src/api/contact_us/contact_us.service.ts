import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactUsEntity } from "../../core/entity/contact_us.entity";
import { ContactUsRepository } from "../../core/repository";
import { CreateContactUsDto } from "./dto/create-contact_us.dto";
import { UpdateContactUsDto } from "./dto/update-contact_us.dto";
import { BaseService } from "../../infrastructure/lib/baseService";

@Injectable()
export class ContactUsService extends BaseService<
	CreateContactUsDto,
	UpdateContactUsDto,
	ContactUsEntity
> {
	constructor(@InjectRepository(ContactUsEntity) private readonly contactRepo: ContactUsRepository) {
		super(contactRepo, "Contact-us");
	}
}

