import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ExecuterEntity } from "../../core/entity";
import { config } from "../../config";
import { ShareBusiness } from "../business/dto/share-business.dto";

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendMailLink(user: ExecuterEntity, token: string) {
		const url = `${String(process.env.API_HOST)}:${Number(
			process.env.PORT,
		)}/auth/login?token=${token}`;
		await this.mailerService.sendMail({
			from: config.MAILDEV_USER,
			to: user.email,
			subject: "Login with email link",
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

	async sendFavsInviteLink(search_email: string, sender_email: string) {
		const url = `${String(process.env.API_HOST)}:${Number(process.env.PORT)}`;
		await this.mailerService.sendMail({
			from: config.MAILDEV_USER,
			to: search_email,
			subject: "Link for web-site",
			template: "./invite-link",
			context: {
				url,
				sender_email,
			},
		});
	}

	async sendReservationMessage(user: ExecuterEntity, data: any) {
		// Xat yuborish
		console.log("user.email: ", user.email);
		await this.mailerService.sendMail({
			from: config.MAILDEV_USER,
			to: user.email,
			subject: "Message about reservation",
			template: "./reservation-message", // HBS shablon nomi
			context: {
				title: data.title, // Sarlavha
				message: data.message, // Xabar tarkibi
			},
		});
		console.log("mail message finished")
	}

	async sendBusinessInviteEmail(toEmail: string, data: ShareBusiness) {
		await this.mailerService.sendMail({
			from: config.MAILDEV_USER,
			to: toEmail,
			subject: `${data.sender} wants to tell you about ${data.business_name}`,
			template: "./share-business", // Name of your .hbs file
			context: {
				sender: data.sender,
				business_name: data.business_name,
				business_link: data.business_link,
				business_image: data.business_image,
				message: data.message,
				business_rating: data.business_rating,
				business_reviews: data.business_reviews,
				business_categories: data.business_categories,
				recipient_email: data.recipient_email,
				email_preferences_link: data.email_preferences_link,
				sender_link: data.sender_link,
			},
		});
	}
}
