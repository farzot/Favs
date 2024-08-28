import { Repository } from "typeorm";
import { ExecuterEntity } from "../entity";

export type UserRepository = Repository<ExecuterEntity>;
