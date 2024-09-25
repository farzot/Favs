import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class SomePhotosNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "some_photos_not_found")), 404);
	}
}
