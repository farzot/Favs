import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class ProductAmountNotEnough extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "product_amount_not_enough")), 400);
	}
}
