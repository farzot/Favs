import { Module } from "@nestjs/common";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer";
// import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./mail.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		// ConfigModule.forRoot(),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get<string>("MAILER_HOST"),
					secure: false,
					auth: {
						user: config.get("MAILDEV_USER"),
						pass: config.get("MAILDEV_PASS"),
					},
				},
				defaults: {
					from: `"Bright-gallery "<${config.get("MAILER_HOST")}>`,
				},
				template: {
					dir: join(process.cwd(), "src", "api", "mail", "templates"),
					adapter: new HandlebarsAdapter(),
					template: "reset",
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
	],

	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
