import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class TelegramChatIDNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "telegram_chat_id_not_found")), 404);
	}
}
