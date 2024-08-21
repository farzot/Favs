import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class BasketAlreadyExists extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "basket_already_exists")), 409);
	}
}
