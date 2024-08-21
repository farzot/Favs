import { Repository } from "typeorm";
import { FaqEntity } from "../entity/faq.entity";

export type FaqRepository = Repository<FaqEntity>;
