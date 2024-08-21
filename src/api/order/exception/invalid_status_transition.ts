import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class InvalidStatusTransition extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "invalid_status_transition")), 400);
	}
}
