import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthorizationError } from "../exception";
import { config } from "src/config";
import { AuthPayload } from "src/common/type";
import { Roles } from "src/common/database/Enums";
import { AdminEntity, UserEntity } from "src/core/entity";
import { UserRepository } from "src/core/repository";
import { UserService } from "src/api/user/user.service";
import { AdminService } from "src/api/admin/admin.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(private userService: UserService, private adminService: AdminService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.ACCESS_SECRET_KEY,
			
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: AuthPayload) {
		let user: UserEntity | AdminEntity | null = null;
    console.log(1, payload);
		try {
			if (payload.role === Roles.USER) {
				user = await this.userService
				.findOneBy("en", {
					where: { id: payload.id, role: payload.role },
				})
				.then((res) => res.data);
			} else {
				user = await this.adminService
					.findOneBy("en", {
						where: { id: payload.id, role: payload.role },
					})
					.then((res) => res.data);
			}
			if (!user || !user?.is_active) {
				console.log(4);
				throw new AuthorizationError();
			}
		} catch (error) {}
		return user;
	}
}
