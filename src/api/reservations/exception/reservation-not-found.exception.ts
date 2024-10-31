import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class ReservationNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "reservation_not_found")), 404);
	}
}
