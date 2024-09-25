import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
	ParseIntPipe,
	ParseUUIDPipe,
	UseInterceptors,
	UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { FilterDto } from "src/common/dto/filter.dto";
import { ExecuterEntity } from "src/core/entity";
import { CurrentExecuter } from "../../common/decorator/current-user";
import { ICurrentExecuter } from "../../common/interface/current-executer.interface";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { DataSource } from "typeorm";
import { createFile, deleteFile } from "../../infrastructure/lib/fileService";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "../../common/type";
import { FileNotFoundException } from "../file/exception/file.exception";

@Controller("/executer")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly dataSource: DataSource,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/create-profile-picture")
	@UseInterceptors(FileInterceptor("profile_picture"))
	public async uploadProfilePicture(
		@UploadedFile() profile_picture: Express.Multer.File, // Fayl yuklanadi
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<IResponse<[]>> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Faylni yaratish
			if (profile_picture) {
				const uploadedProfilePicture = await createFile(profile_picture);
				executerPayload.executer.profile_picture = uploadedProfilePicture;
				await queryRunner.manager.save(ExecuterEntity, executerPayload.executer);

				// Tranzaksiyani yakunlash
				await queryRunner.commitTransaction();

				const message = responseByLang("create", lang);
				return { status_code: 200, data: [], message };
			} else {
				throw new Error("No file uploaded");
			}
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete("/delete-profile-picture")
	public async deleteProfilePicture(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<IResponse<[]>> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Foydalanuvchining profile_picture maydonini o'chirish
			if (executerPayload.executer.profile_picture.length !== 0) {
				await deleteFile(executerPayload.executer.profile_picture[0]); // Fayl tizimdan o'chiriladi
				executerPayload.executer.profile_picture = "";
				await queryRunner.manager.save(ExecuterEntity, executerPayload.executer);

				// Tranzaksiyani yakunlash
				await queryRunner.commitTransaction();

				const message = responseByLang("delete", lang);
				return { status_code: 200, data: [], message };
			} else {
				throw new FileNotFoundException();
			}
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/all-users")
	public findAllUsers(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.userService.findAllWithPagination(lang, {
			order: { id: "DESC" },
			where: { is_deleted: false, role: Roles.USER },
			relations: { locations: true },
			take: query.page_size,
			skip: query.page,
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/all-business-owners")
	public findAllBusinessOwners(@CurrentLanguage() lang: string, @Query() query: FilterDto) {
		return this.userService.findAllWithPagination(lang, {
			order: { id: "DESC" },
			where: { is_deleted: false, role: Roles.BUSINESS_OWNER },
			relations: { locations: true },
			take: query.page_size,
			skip: query.page,
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	// @RolesDecorator(Roles.USER,Roles.ADMIN)
	@Get("/get-self-user-info")
	public findSelfUserInfo(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.userService.findOneBy(lang, {
			where: { id: executerPayload.executer.id, is_deleted: false },
			relations: { locations: true },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get(":id")
	public findOne(@Param("id", ParseUUIDPipe) id: string, @CurrentLanguage() lang: string) {
		return this.userService.findOneById(id, lang, { where: { is_deleted: false } });
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/username/:username")
	public findOneByUsername(@Param("username") username: string, @CurrentLanguage() lang: string) {
		return this.userService.findOneBy(lang, {
			where: { is_deleted: false, username: username },
		});
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Patch("/update-self-user-info")
	public async updateUserSelfInfo(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@Body() dto: UpdateUserDto,
	) {
		await this.userService.findOneById(executerPayload.executer.id, lang, {
			where: { is_deleted: false },
		});
		return this.userService.updateUserSelfInfo(dto, lang, executerPayload.executer);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Delete("/delete-user-self-account")
	public async removeSelfUser(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		await this.userService.findOneById(executerPayload.executer.id, lang, {
			where: { is_deleted: false },
		});
		return await this.userService.delete(executerPayload.executer.id, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(
		Roles.USER,
		Roles.BUSINESS_MANAGER,
		Roles.BUSINESS_OWNER,
		Roles.ADMIN,
		Roles.SUPER_ADMIN,
	)
	@Patch("/self-change-password")
	public async changPassword(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
		@Body() dto: ChangePasswordDto,
	) {
		return await this.userService.changePassword(dto, executerPayload.executer, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.USER)
	@Patch("/set-profile-private")
	public async setProfilePrivate(
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<IResponse<[]>> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Foydalanuvchi profilini private holatga o'zgartirish
			executerPayload.executer.is_profile_private = true;
			await queryRunner.manager.save(ExecuterEntity, executerPayload.executer);

			// Tranzaksiyani yakunlash
			await queryRunner.commitTransaction();

			const message = responseByLang("update", lang);
			return { status_code: 200, data: [], message };
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post("/invite-link")
	public async inviteToFavs(
		@Body("email") email: string,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	): Promise<IResponse<unknown>> {
		return await this.userService.inviteToFavs(email,executerPayload.executer,lang);
	}
}
