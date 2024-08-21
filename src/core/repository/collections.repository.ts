import { Repository } from "typeorm";
import { CollectionsEntity } from "../entity";

export type CollectionsRepository = Repository<CollectionsEntity>