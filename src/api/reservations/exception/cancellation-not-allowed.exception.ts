import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class CancellationNotAllowed extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "cancellation_not_allowed")), 400);
	}
}

export class RuhsatEtilmaganHarakat extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "ruhsat_etilmagan_harakat")), 423);
	}
}
