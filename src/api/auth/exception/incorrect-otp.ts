import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class IncorrectOTP extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "incorrect_otp")), 400);
	}
}
