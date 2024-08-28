import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthorizationError } from "../exception";
import { ExecuterRepository } from "src/core/repository/executer.repository";
import { config } from "src/config";
import { AuthPayload } from "src/common/type";
import { Roles } from "src/common/database/Enums";
import { ExecuterEntity } from "src/core/entity";
import { UserService } from "src/api/user/user.service";
import { AdminService } from "src/api/admin/admin.service";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		@InjectRepository(ExecuterEntity) private executerRepository: ExecuterRepository,
		private userService: UserService,
		private adminService: AdminService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.ACCESS_SECRET_KEY,

			// passReqToCallback: true,
		});
	}

	async validate(payload: AuthPayload) {
		let executer: ExecuterEntity | null = null;
		// if roles that don't work in some part of the project, check all app roles should be included here
		if (payload.role === Roles.USER) {
			executer = await this.executerRepository.findOne({
				where: {
					id: payload.id,
					role: Roles.USER,
					is_active: true,
				},
				// relations: { business: true, store: { warehouse: true } },
			});
		} else if (payload.role === Roles.ADMIN) {
			executer = await this.executerRepository.findOne({
				where: {
					id: payload.id,
					role: Roles.ADMIN,
					is_active: true,
					is_deleted: false,
				},
				// relations: { business: true, store: { business: true }},
			});
		} else if (payload.role === Roles.BUSINESS_STORE_ADMIN) {
			executer = await this.executerRepository.findOne({
				where: {
					id: payload.id,
					role: Roles.BUSINESS_STORE_ADMIN,
					is_active: true,
					is_deleted: false,
				},
				// relations: { business: true, store: { business: true }},
			});
		} else if (payload.role === Roles.BUSINESS_STORE_MANAGER) {
			executer = await this.executerRepository.findOne({
				where: {
					id: payload.id,
					role: Roles.BUSINESS_STORE_MANAGER,
					is_active: true,
					is_deleted: false,
				},
				// relations: { business: true, store: { business: true }},
			});
		} else if (payload.role === Roles.BUSINESS_MANAGER) {
			executer = await this.executerRepository.findOne({
				where: {
					id: payload.id,
					role: Roles.BUSINESS_MANAGER,
					is_active: true,
					is_deleted: false,
				},
				// relations: { business: true, store: { business: true }},
			});
		} else if (payload.role === Roles.BUSINESS_OWNER) {
			executer = await this.executerRepository.findOne({
				where: {
					id: payload.id,
					role: Roles.BUSINESS_OWNER,
					is_active: true,
					is_deleted: false,
				},
				// relations: { business: true, store: { business: true }},
			});
		} else if (payload.role === Roles.SUPER_ADMIN) {
			executer = await this.executerRepository.findOne({
				where: {
					id: payload.id,
					role: Roles.SUPER_ADMIN,
					is_active: true,
					is_deleted: false,
				},
				// relations: { business: true, store: { business: true }},
			});
		}
		if (!executer) {
			throw new AuthorizationError();
		}

		return {
			executer,
			business: payload.business_id,
			store: payload.store_id,
			// avaliable_stores: payload.avaliable_stores,
		};
	}
}
