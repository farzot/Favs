import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";

export class CancelReservationDto {
	@IsNotEmpty()
	@IsUUID()
	public reservation_id!: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	public cancellation_reason!: string;

	// @IsNotEmpty()
	// @IsString()
	// readonly cancellation_date!: Date;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	public cancellation_time!: Date;

	// @IsOptional()
	// @IsNotEmpty()
	// @IsString()
	// readonly cancellation_notes!: string;
}
