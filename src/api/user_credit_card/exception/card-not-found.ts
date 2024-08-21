import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class CardNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "user_credit_card_not_found")), 404);
	}
}
