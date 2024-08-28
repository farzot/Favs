import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import {  ExecuterEntity } from "src/core/entity";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./user/AuthStrategy";
import { UserModule } from "../user/user.module";
import { AdminModule } from "../admin/admin.module";
import { GoogleStrategy } from "../../infrastructure/lib/strategies/google.strategy";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "../mail/mail.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([ExecuterEntity]),
		JwtModule,
		UserModule,
		AdminModule,
		PassportModule,
		MailModule
	],
	controllers: [AuthController],
	providers: [AuthService, JwtToken, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
