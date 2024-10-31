import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";

export class  CreateReservationDto {
	@IsNotEmpty()
	@IsUUID()
	public business_id!: string;

	@IsNotEmpty()
	@IsString()
	public guest_name!: string;

	@IsNotEmpty()
	@IsString()
	public guest_phone!: string;

	@IsNotEmpty()
	@IsNumberString()
	public number_of_guests!: number;

	@IsNotEmpty()
	public reservation_time!: number;

	@IsNotEmpty()
	@IsNumberString()
	public deposit_amount?: number;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	public details!: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	public payment_method!: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	public payment_status!: string;
}
