import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class LocationNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "user_location_not_found")), 404);
	}
}
