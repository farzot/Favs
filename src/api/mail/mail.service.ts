import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ExecuterEntity } from "../../core/entity";
import { config } from "../../config";

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendMailLink(user: ExecuterEntity, token: string) {
		const url = `${String(process.env.API_HOST)}:${Number(
			process.env.PORT,
		)}/auth/reset-password?token=${token}`;
		await this.mailerService.sendMail({
			from: config.MAILDEV_USER,
			to: user.email,
			subject: "Reset Password",
			template: "./reset",
			context: {
				name: user.first_name,
				url,
			},
		});
	}
	async sendOTP(email: string, otp: string) {
		await this.mailerService.sendMail({
			from: config.MAILDEV_USER,
			to: email,
			subject: "OTP Verification",
			template: "./otp",
			context: {
				otp,
			},
		});
	}
}
