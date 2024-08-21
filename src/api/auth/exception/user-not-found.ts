import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class UserNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "user_not_found")), 400);
	}
}
