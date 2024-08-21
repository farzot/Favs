import { Repository } from "typeorm";
import { ChatEntity } from "../entity";

export type ChatRepository = Repository<ChatEntity>;
