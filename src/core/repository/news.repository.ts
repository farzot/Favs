import { Repository } from "typeorm";
import { NewsEntity } from "../entity/news.entity";

export type NewsRepository = Repository<NewsEntity>;
