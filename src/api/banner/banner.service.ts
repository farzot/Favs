import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BannerEntity } from "src/core/entity/banner.entity";
import { BannerRepository } from "src/core/repository/banner.repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";

@Injectable()
export class BannerService extends BaseService<CreateBannerDto, UpdateBannerDto, BannerEntity> {
	constructor(@InjectRepository(BannerEntity) private readonly bannerRepo: BannerRepository) {
		super(bannerRepo, "banner");
	}
}
