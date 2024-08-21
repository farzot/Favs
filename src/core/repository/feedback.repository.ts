import { Repository } from "typeorm";
import { FeedbackEntity } from "../entity";

export type FeedbackRepository = Repository<FeedbackEntity>;
