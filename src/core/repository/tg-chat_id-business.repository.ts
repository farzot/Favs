import { Repository } from "typeorm";
import { TelegramChatIDEntity } from "../entity/tg-chat-id-business.entity";

export type TelegramChatIDRepository = Repository<TelegramChatIDEntity>;
