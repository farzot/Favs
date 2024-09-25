import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class BusinessNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "business_not_found")), 404);
	}
}
