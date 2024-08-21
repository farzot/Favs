import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class ImageNameNotFound extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "image_name_not_found")), 404);
	}
}
