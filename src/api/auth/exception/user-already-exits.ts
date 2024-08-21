import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class UserAlreadyExists extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "user_already_exists")), 409);
	}
}
