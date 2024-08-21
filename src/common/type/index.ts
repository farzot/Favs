import { IsNotEmpty, IsString } from "class-validator";
import { Roles } from "../database/Enums";

export class ObjDto {
	@IsNotEmpty()
	@IsString()
	id!: string;
}

export interface IResponse<T> {
	status_code: number;
	data: T;
	message: string;
}

export interface AuthPayload {
	id: string;
	role: Roles;
	email: string
}
