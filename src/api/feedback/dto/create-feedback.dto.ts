import {
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	ValidateNested
} from "class-validator";
import { ObjDto } from "../../../common/type";
import { Type } from "class-transformer";

export class CreateFeedbackDto {
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	public text!: string;

	@IsNotEmpty()
	@IsNumberString()
	public product!: string;

	@IsNotEmpty()
	@IsNumberString()
	public rate!: number;
}
