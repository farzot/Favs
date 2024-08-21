import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthorizationError } from "../exception";
import { UserEntity } from "src/core/entity";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { UserService } from "src/api/user/user.service";
import { AuthPayload } from "src/common/type";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {

	handleRequest<T = UserEntity>(
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





// import { AuthGuard } from "@nestjs/passport";
// import { ExecutionContext, Injectable } from "@nestjs/common";
// import { AuthorizationError } from "../exception";
// import { UserEntity } from "src/core/entity";
// import { JwtToken } from "src/infrastructure/lib/jwt-token";
// import { UserService } from "src/api/user/user.service";
// import { AuthPayload } from "src/common/type";
// import { Response } from "express";
// import { config } from "src/config";

// @Injectable()
// export class JwtAuthGuard extends AuthGuard("jwt") {
// 	constructor(
// 		private readonly jwtService: JwtToken,
// 		private userService: UserService,
// 	) {
// 		super();
// 	}

// 	async canActivate(context: ExecutionContext): Promise<boolean> {
// 		const req = context.switchToHttp().getRequest();
// 		const res: Response = context.switchToHttp().getResponse();
    
// 		try {
//       await super.canActivate(context);
// 			return true;
// 		} catch (err: any) {
//       console.log(12, err);
// 			if (err.status === 401) {
// 				const refreshToken = req.cookies["refresh_token"];

// 				if (!refreshToken) {
// 					throw new AuthorizationError();
// 				}

// 				const payload: AuthPayload = await this.jwtService.verifyRefresh(refreshToken);

// 				const {data: user} = await this.userService.findOneById(payload.id, "eng", {
// 					where: { role: payload.role },
// 				});

// 				if (!user) {
// 					throw new AuthorizationError();
// 				}

// 				const token = await this.jwtService.generateToken(user);

// 				// Yangi access tokenni response cookiesiga qo'shish
// 				res.cookie("refresh_token", token.refresh_token, {
// 					httpOnly: true,
// 					// secure: true, // HTTPS orqali jo'natilishi kerak
// 					sameSite: "strict",
//           maxAge: Date.now() + config.COOKIE_AGE * 24 * 60 * 60 * 1000, // 1 kun (millisekundlarda)
// 				});

// 				req.headers["Authorization"] = `Bearer ${token.access_token}`;
//         console.log(22222222);
        
// 				return true;
// 			}

// 			throw new AuthorizationError();
// 		}
// 	}

// 	handleRequest<T = UserEntity>(
// 		error: unknown,
// 		user: T,
// 		info: any,
// 		context: ExecutionContext,
// 	): T {
// 		if (error || !user) {
// 			throw error || new AuthorizationError();
// 		}
// 		return user;
// 	}
// }
