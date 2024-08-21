import { Repository } from "typeorm";
import { PromoCodeEntity } from "../entity/promocode.entity";

export type PromoCodeRepository = Repository<PromoCodeEntity>;
