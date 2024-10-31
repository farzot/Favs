import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class TelegramTopicIDNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "telegram_topic_id_not_found")), 404);
	}
}
