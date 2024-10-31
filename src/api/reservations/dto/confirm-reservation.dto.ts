import { IsNotEmpty, IsNumberString, IsString, IsUUID } from "class-validator";

export class ConfirmReservationDto {
	@IsNotEmpty()
	@IsUUID()
	readonly reservation_id!: string;

	// @IsNotEmpty()
	// @IsString()
	// readonly confirmation_number!: string;

	// @IsNotEmpty()
	// @IsString()
	// readonly confirmation_date!: Date;

	@IsNotEmpty()
	// @IsString()
	readonly confirmation_time!: Date;

	@IsNotEmpty()
	@IsString()
	readonly confirmation_notes!: string;
}
