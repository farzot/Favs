import { Repository } from "typeorm";
import { FriendshipEntity } from "../entity/friendship.entity";

export type FriendshipRepository = Repository<FriendshipEntity>