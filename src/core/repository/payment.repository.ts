import { Repository } from "typeorm";
import { PaymentEntity } from "../entity/payment.entity";

export type PaymentRepository = Repository<PaymentEntity>;
