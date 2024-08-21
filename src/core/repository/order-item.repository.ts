import { Repository } from "typeorm";
import { OrderItemEntity } from "../entity";

export type OrderItemRepository = Repository<OrderItemEntity>;
