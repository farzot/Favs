import { Repository } from "typeorm";
import { NotificationEntity } from "../entity/notification.entity";

export type NotificationRepository = Repository<NotificationEntity>;
