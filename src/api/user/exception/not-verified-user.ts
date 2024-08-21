import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class NotVerifiedUser extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "not_verified_user")), 400);
	}
}
