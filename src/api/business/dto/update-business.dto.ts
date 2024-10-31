import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDto } from './create-business.dto';
import { IsBoolean } from 'class-validator';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
export class UpdateBusinessByBusAdmins {
	@IsBoolean()
	is_delivery_available?: boolean;
	@IsBoolean()
	is_checkout_available?: boolean;
	@IsBoolean()
	is_reservation_available?: boolean;
	@IsBoolean()
	is_reservation_blocked?: boolean;
	@IsBoolean()
	reservation_deposit_amount?: number;
}