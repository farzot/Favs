import {
	Controller,
	Get,
	Post,
	Body,
	Res,
	UseGuards,
	Req,
	HttpStatus,
	HttpCode,
	Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { LoginDto } from "./dto/login.dto";
import { CurrentLanguage } from "../../common/decorator/current-language";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RolesGuard } from "./roles/RoleGuard";
import { JwtAuthGuard } from "./user/AuthGuard";
import { RolesDecorator } from "./roles/RolesDecorator";
import { Roles } from "../../common/database/Enums";
import { ExecuterEntity } from "../../core/entity";
import { ActivateUserDto } from "./dto/activate-user.dto";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { VerifySMSCodeDto } from "./dto/verify-sms-code.dto";
import { SendSMSCodeDto } from "./dto/send-sms-code.dto";

@Controller("/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("/o")
	@UseGuards(AuthGuard("google"))
	async googleAuth(@Req() req: any): Promise<any> {
		// console.log('gooogle_zaproz');
	}

	@Get("google/callback")
	@UseGuards(AuthGuard("google"))
	public async googleAuthRedirect(
		@Req() req: any,
		@Res() res: any,
		@CurrentLanguage() lang: string,
	) {
		const user = req.user;
		const validatedUser = await this.authService.validateUserGoogle(
			user.googleId,
			user.email,
			user.firstName,
			user.lastName,
			user.password,
			lang,
		);
		// res.redirect(`https://iticket.uz/success?user=${encodeURIComponent(JSON.stringify(user))}`);

		// res.redirect(`https://iticket.uz`);
		return res.json(validatedUser).end();
	}

	@Post("/register")
	@HttpCode(HttpStatus.CREATED)
	public async signUp(@Body() signUpDto: CreateAuthDto, @CurrentLanguage() lang: string) {
		return this.authService.register(signUpDto, lang);
	}

	@Post("/activate")
	@HttpCode(HttpStatus.CREATED)
	public async activate(@Body() dto: ActivateUserDto, @CurrentLanguage() lang: string) {
		return this.authService.activate(dto, lang);
	}

	@Post("/login")
	@HttpCode(HttpStatus.OK)
	public async login(@Body() loginDto: LoginDto, @CurrentLanguage() lang: string) {
		return this.authService.login(loginDto, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.USER)
	@Post("/logout")
	@HttpCode(HttpStatus.OK)
	public async logout(
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@CurrentLanguage() lang: string,
	) {
		return this.authService.logout(executerPayload.executer, lang);
	}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/refresh-token")
	@HttpCode(HttpStatus.OK)
	public async refreshToken(@Body("token") token: string, @CurrentLanguage() lang: string) {
		return this.authService.refreshToken(token, lang);
	}

	@Post("/login-with-link")
	public async loginWithLink(@Body("email") email: string, @CurrentLanguage() lang: string) {
		return this.authService.loginWithLink(email, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/send-sms-code")
	public async sendSmsCode(@Body() dto: SendSMSCodeDto, @CurrentLanguage() lang: string) {
		return this.authService.sendSMSCode(dto, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/verify-sms-code")
	public async verfSmsCode(@Body() dto: VerifySMSCodeDto, @CurrentLanguage() lang: string) {
		return this.authService.verifySMSCode(dto, lang);
	}
}
