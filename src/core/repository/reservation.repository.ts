import { Repository } from "typeorm";
import { ReservationEntity } from "../entity";

export type ReservationRepository = Repository<ReservationEntity>;
