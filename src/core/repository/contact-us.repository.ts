import { Repository } from "typeorm";
import { ContactUsEntity } from "../entity/contact_us.entity";

export type ContactUsRepository = Repository<ContactUsEntity>;
