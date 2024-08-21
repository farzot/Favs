import { Repository } from "typeorm";
import { BusinessPhotosEntity } from "../entity";

export type BusinessPhotoRepository = Repository<BusinessPhotosEntity>;
