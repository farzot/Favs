import { Repository } from "typeorm";
import { UserLocationEntity } from "../entity";

export type UserLocationRepository = Repository<UserLocationEntity>;
