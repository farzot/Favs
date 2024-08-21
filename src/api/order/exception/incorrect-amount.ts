import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class SentIncorrectAmount extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "sent_incorrect_amount")), 400);
	}
}
