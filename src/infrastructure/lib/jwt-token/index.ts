import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { log } from "console";
import { config } from "src/config";
import { ExecuterEntity } from "src/core/entity";

@Injectable()
export class JwtToken {
	constructor(private readonly jwt: JwtService) {}

	public async generateToken(
		user: ExecuterEntity,
		expire_time: string,
		secret_key: string,
	): Promise<string> {
		const payload = {
			id: user.id,
			role: user.role,
			email: user.email,
		};
		console.log(`payload: `, payload);
		return this.jwt.signAsync(payload, {
			secret: secret_key,
			expiresIn: expire_time,
		});
	}

	public async generateAdminToken(admin: ExecuterEntity) {
		const payload = {
			id: admin.id,
			role: admin.role,
			phone_number: admin.phone_number,
		};

		const token = await this.jwt.signAsync(payload, {
			secret: config.ACCESS_SECRET_KEY,
			expiresIn: "3d",
		});

		return token;
	}

	public async verifyAccess(token: string) {
		return this.jwt.verifyAsync(token, { publicKey: config.ACCESS_SECRET_KEY });
	}

	public async verifyRefresh(token: string) {
		return this.jwt.verifyAsync(token, { publicKey: config.REFRESH_SECRET_KEY });
	}

	// public async generateToken(
	// 	user: ExecuterEntity,
	// 	time: string
	// ): Promise<{ access_token: string; refresh_token: string }> {
	// 	const payload = {
	// 		id: user.id,
	// 		role: user.role,
	// 		email: user.email,
	// 	};

	// 	const [access_token, refresh_token] = await Promise.all([
	// 		this.jwt.sign(payload, {
	// 			secret: config.ACCESS_SECRET_KEY,
	// 			expiresIn: config.ACCESS_SECRET_TIME,
	// 		}),
	// 		this.jwt.sign(payload, {
	// 			secret: config.REFRESH_SECRET_KEY,
	// 			expiresIn: config.REFRESH_SECRET_TIME,
	// 		}),
	// 	]);
	// 	return { access_token, refresh_token };
	// }
}
