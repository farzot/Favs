import { Repository } from "typeorm";
import { SMSTokenEntity } from "../entity/sms-token.entity";

export type SMSTokenRepository = Repository<SMSTokenEntity>;
