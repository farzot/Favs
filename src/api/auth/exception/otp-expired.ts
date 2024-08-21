import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class OtpExpired extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "otp_expired")), 400);
	}
}
