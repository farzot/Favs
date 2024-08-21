import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class FeedbackNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "feedback_not_found")), 404);
	}
}
