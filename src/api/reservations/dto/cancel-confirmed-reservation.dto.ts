// cancel-reservation.dto.ts
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CancelConfirmedReservationDto {
	@IsNotEmpty()
	@IsUUID()
	public reservation_id!: string;

	@IsString()
	@IsNotEmpty()
	public cancellation_reason?: string;
}
