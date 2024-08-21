import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class DiscountPriceNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "discount_price_not_found")), 404);
	}
}

export class DiscountPercentNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "discount_percent_not_found")), 400);
	}
}
