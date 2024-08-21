import * as dotenv from "dotenv";
import { Logger } from "@nestjs/common";

dotenv.config();

export type ConfigType = {
	PORT: number;
	DB_URL: string;
	ACCESS_SECRET_KEY: string;
	ACCESS_EXPIRE_TIME: string;
	REFRESH_SECRET_KEY: string;
	REFRESH_EXPIRE_TIME: string;
	NODE_ENV: string;
	APP_LOGS_PATH: string;
	OPERATION_LOGS_PATH: string;
	FILE_SIZE: number;
	PATH_FOR_FILE_UPLOAD: string;
	MAILER_HOST: string;
	MAILER_PORT: number;
	MAILDEV_USER: string;
	MAILDEV_PASS: string;
	API_HOST: string;
	RESET_TOKEN_EXPIRE_TIME: string;
	BOT_TOKEN: string;
	CHAT_ID:string
};

const requiredVariables = [
	"PORT",
	"DEV_DB_URL",
	"PROD_DB_URL",
	"ACCESS_SECRET_KEY",
	"ACCESS_EXPIRE_TIME",
	"REFRESH_SECRET_KEY",
	"REFRESH_EXPIRE_TIME",
	"NODE_ENV",
	"APP_LOGS_PATH",
	"OPERATION_LOGS_PATH",
	"FILE_SIZE",
	"PATH_FOR_FILE_UPLOAD",
	"MAILER_HOST",
	"MAILER_PORT",
	"MAILDEV_USER",
	"MAILDEV_PASS",
	"API_HOST",
	"RESET_TOKEN_EXPIRE_TIME",
	"BOT_TOKEN",
	"CHAT_ID",
];

const missingVariables = requiredVariables.filter((variable) => {
	const value = process.env[variable];
	return !value || value.trim() === "";
});

if (missingVariables.length > 0) {
	Logger.error(`Missing or empty required environment variables: ${missingVariables.join(", ")}`);
	process.exit(1);
}

export const config: ConfigType = {
	PORT: parseInt(process.env.PORT as string, 10),
	DB_URL:
		process.env.NODE_ENV === "dev"
			? (process.env.DEV_DB_URL as string)
			: (process.env.PROD_DB_URL as string),
	ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY as string,
	ACCESS_EXPIRE_TIME: process.env.ACCESS_EXPIRE_TIME as string,
	REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY as string,
	REFRESH_EXPIRE_TIME: process.env.REFRESH_EXPIRE_TIME as string,
	NODE_ENV: process.env.NODE_ENV as string,
	APP_LOGS_PATH: process.env.APP_LOGS_PATH as string,
	OPERATION_LOGS_PATH: process.env.OPERATION_LOGS_PATH as string,
	FILE_SIZE: parseInt(process.env.FILE_SIZE as string, 10),
	PATH_FOR_FILE_UPLOAD: process.env.PATH_FOR_FILE_UPLOAD as string,
	MAILER_HOST: process.env.MAILER_HOST as string,
	MAILER_PORT: parseInt(process.env.MAILER_PORT as string, 10),
	MAILDEV_USER: process.env.MAILDEV_USER as string,
	MAILDEV_PASS: process.env.MAILDEV_PASS as string,
	API_HOST: process.env.API_HOST as string,
	RESET_TOKEN_EXPIRE_TIME: process.env.RESET_TOKEN_EXPIRE_TIME as string,
	BOT_TOKEN: process.env.BOT_TOKEN as string,
    CHAT_ID: process.env.CHAT_ID as string,
};
