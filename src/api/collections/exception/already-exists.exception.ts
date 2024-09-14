import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class AlreadyExistsError extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "already_exists_error")), 409);
	}
}
