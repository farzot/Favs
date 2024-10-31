import { Repository } from "typeorm";
import { TelegramTopicIDEntity } from "../entity/tg-topic-id-business.entity";

export type TelegramTopicIDRepository = Repository<TelegramTopicIDEntity>;
