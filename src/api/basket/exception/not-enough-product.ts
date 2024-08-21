import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class NotEnoughProduct extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "not_enough_product")), 400);
	}
}
