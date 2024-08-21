import { Injectable } from "@nestjs/common";
import { CreatePromocodeDto } from "./dto/create-promocode.dto";
import { UpdatePromocodeDto } from "./dto/update-promocode.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PromoCodeEntity } from "../../core/entity";
import { PromoCodeRepository } from "../../core/repository";
import { BaseService } from "../../infrastructure/lib/baseService";

@Injectable()
export class PromocodeService extends BaseService<
	CreatePromocodeDto,
	UpdatePromocodeDto,
	PromoCodeEntity
> {
	constructor(
		@InjectRepository(PromoCodeEntity) private readonly promocodeRepo: PromoCodeRepository,
	) {
		super(promocodeRepo, "Promocode");
	}
}
