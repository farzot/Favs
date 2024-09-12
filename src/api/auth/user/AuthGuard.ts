import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthorizationError } from "../exception";
import { ExecuterEntity } from "src/core/entity";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	handleRequest<T = ExecuterEntity>(
		error: unknown,
		user: T,
		info: any,
		context: ExecutionContext,
	): T {
		if (error || !user) {
			throw error || new AuthorizationError();
		}
		return user;
	}
}
