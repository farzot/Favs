import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class ChatIDNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "chat_id_not_found")), 404);
	}
}
