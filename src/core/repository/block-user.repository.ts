import { Repository } from "typeorm";
import { BlockEntity } from "../entity";

export type BlockRepository = Repository<BlockEntity>