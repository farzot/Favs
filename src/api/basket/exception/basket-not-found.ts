import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class BasketNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "basket_not_found")), 404);
	}
}
