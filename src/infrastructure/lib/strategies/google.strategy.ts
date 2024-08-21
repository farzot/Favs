import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor() {
		super({
			clientID: "994973740930-on1kb23372bo9vvv1imfbd8kipv7jalp.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:8013/api/auth/google/callback",
			scope: ["profile", "email"],
		});
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		console.log("Najim_1");

		const { name, emails, photos, phone, password } = profile;
		const user = {
			googleId: profile.id,
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			phone: phone,
			password:password,
			accessToken,
		};
		done(null, user);
	}
}
