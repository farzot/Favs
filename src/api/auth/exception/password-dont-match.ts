import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class PasswordNotMatch extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "password_not_match")), 400);
	}
}
