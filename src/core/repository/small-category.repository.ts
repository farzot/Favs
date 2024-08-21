import { Repository } from "typeorm";
import { SmallCategoryEntity } from "../entity/small-category.entity";

export type SmallCategoryRepository = Repository<SmallCategoryEntity>;
