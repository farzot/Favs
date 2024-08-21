import { Repository } from "typeorm";
import { UserCreditCardEntity } from "../entity/user-credit-card.entity";

export type UserCreditCardRepository = Repository<UserCreditCardEntity>;
