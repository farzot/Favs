import { Repository } from "typeorm";
import { BannerEntity } from "../entity";

export type BannerRepository = Repository<BannerEntity>;
