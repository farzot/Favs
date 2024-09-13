import { Repository } from "typeorm";
import { BusinessEntity } from "../entity";

export type BusinessRepository = Repository<BusinessEntity>;
