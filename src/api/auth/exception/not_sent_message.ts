;
import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class NotSentMessage extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "not_sent_message")), 400);
	}
}
