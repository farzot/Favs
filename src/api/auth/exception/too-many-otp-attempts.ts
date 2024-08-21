import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class TooManyOtpAttempts extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "too_many_otp_attempts")), 429);
	}
}
