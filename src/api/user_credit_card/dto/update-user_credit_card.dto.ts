import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCreditCardDto } from './create-user_credit_card.dto';

export class UpdateUserCreditCardDto extends PartialType(CreateUserCreditCardDto) {}
