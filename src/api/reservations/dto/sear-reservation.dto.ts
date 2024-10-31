import { IsOptional, IsEnum, IsDateString, IsUUID, IsString } from "class-validator";
import { ReservationStatus } from "../../../common/database/Enums";

export class SearchReservationDto {
	@IsOptional()
	@IsEnum(ReservationStatus)
	status?: ReservationStatus;
	date?: DateRangeDto; // Yangi DTO ni bu yerda ishlatish
}

export class DateRangeDto {
	@IsDateString()
	start!: string; // Boshlanish vaqti

	@IsDateString()
	end!: string; // Tugash vaqti
}

export class SearchReservationByAdminDto {
	@IsOptional()
	@IsUUID()
	business_id?: string;
	
	@IsOptional()
	@IsString()
	username?: string;

	@IsOptional()
	@IsEnum(ReservationStatus)
	status?: ReservationStatus; // Rezervatsiya statusi

	@IsOptional()
	date?: DateRangeDto;
	// date?: { start: string; end: string }; // Sana filtrlash uchun
}
