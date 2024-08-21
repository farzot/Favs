import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class ProductNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "product_not_found")), 404);
	}
}
