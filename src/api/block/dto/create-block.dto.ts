import { IsNotEmpty } from "class-validator";

export class CreateBlockDto {
	@IsNotEmpty()
	blocker_id!: string;
	@IsNotEmpty()
	blocked_id!: string;
}
