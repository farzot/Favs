import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessFaqDto, CreateFaqDto } from './create-faq.dto';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {}


export class UpdateBusinessFaqDto extends PartialType(CreateBusinessFaqDto) {}
