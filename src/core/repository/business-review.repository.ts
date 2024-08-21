import { Repository } from "typeorm";
import { BusinessReviewEntity } from "../entity";

export type BusinessReviewRepository = Repository<BusinessReviewEntity>;
