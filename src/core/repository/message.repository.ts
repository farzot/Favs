import { Repository } from "typeorm";
import { MessageEntity } from "../entity";

export type MessageRepository = Repository<MessageEntity>;
