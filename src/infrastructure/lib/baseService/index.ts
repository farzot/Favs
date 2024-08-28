import { HttpException, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { IFindOptions, IResponse, IResponsePagination } from "./interface";
import { RepositoryPager } from "../pagination";
import { responseByLang, returnResponseMessage } from "../prompts/successResponsePrompt";
import { ExecuterEntity } from "../../../core/entity/executer.entity";

export class BaseService<CreateDto, UpdateDto, Entity> {
	constructor(
		private readonly repository: Repository<any>,
		private readonly entityName: string,
	) {}

	get getRepository() {
		return this.repository;
	}

	async create(
		dto: CreateDto,
		lang: string,
		executer?: ExecuterEntity,
	): Promise<IResponse<Entity>> {
		let created_data = this.repository.create({
			...dto,
			created_at: Date.now(),
			created_by: executer,
		}) as unknown as Entity;
		created_data = await this.repository.save(created_data);
		const message = responseByLang("create", lang);
		return {
			status_code: 201,
			message,
			data: created_data,
		};
	}

	async findAll(lang: string, options?: IFindOptions<Entity>): Promise<IResponse<Entity[]>> {
		const data = (await this.repository.find({
			...options,
		})) as Entity[];
		const message = responseByLang("get_all", lang);
		return {
			status_code: 200,
			message,
			data: data,
		};
	}

	async findAllWithPagination(
		lang: string,
		options?: IFindOptions<Entity>,
	): Promise<IResponsePagination<Entity>> {
		const message = responseByLang("get_all", lang);
		return await RepositoryPager.findAll(this.getRepository, message, options);
	}

	async findOneBy(lang: string, options: IFindOptions<Entity>): Promise<IResponse<Entity>> {
		const data = (await this.repository.findOne({
			select: options.select || {},
			relations: options.relations || [],
			where: options.where,
		})) as Entity;
		if (!data) {
			const error_data = {
				message: [
					`${this.entityName} Not found`,
					`${this.entityName} не найден`,
					`${this.entityName} topilmadi`,
				],
				status_code: 404,
			};
			Logger.error({
				message: error_data.message,
				status_code: error_data.status_code,
				user: "none",
				stack: error_data,
				context: `${BaseService.name}  function findOneById `,
			});
			throw new HttpException(error_data.message, error_data.status_code);
		}
		const message = responseByLang("get_one", lang);
		return {
			status_code: 200,
			message,
			data: data,
		};
	}

	async findOneById(
		id: string,
		lang: string,
		options?: IFindOptions<Entity>,
	): Promise<IResponse<Entity>> {
		const data = (await this.repository.findOne({
			select: options?.select || {},
			relations: options?.relations || [],
			where: { id, ...options?.where },
		})) as unknown as Entity;
		if (!data) {
			const error_data = {
				message: [
					`${this.entityName} Not found`,
					`${this.entityName} не найден`,
					`${this.entityName} topilmadi`,
				],
				status_code: 404,
			};
			Logger.error({
				message: error_data.message,
				status_code: error_data.status_code,
				user: "none",
				stack: error_data,
				context: `${BaseService.name}  function findOneById `,
			});
			throw new HttpException(error_data.message, error_data.status_code);
		}
		const message = responseByLang("get_one", lang);
		return {
			status_code: 200,
			message,
			data,
		};
	}

	async update(id: string, dto: UpdateDto, lang: string, executer?: ExecuterEntity) {
		await this.repository.update(id, {
			...dto,
			updated_by: executer,
			updated_at: Date.now(),
		});
		const message = responseByLang("update", lang);
		return { status_code: 200, message, data: {} };
	}

	async disactive(id: string, lang: string): Promise<IResponse<Entity>> {
		const data = (await this.repository.update(
			{ id },
			{ is_active: false },
		)) as unknown as Entity;
		const responseMessages = [
			`${this.entityName} was deactivated`,
			`${this.entityName} был деактивирован`,
			`${this.entityName} faolsizlantirildi`,
		];
		const message = returnResponseMessage(responseMessages, lang);
		return {
			status_code: 200,
			message,
			data,
		};
	}

	async active(id: string, lang: string): Promise<IResponse<Entity>> {
		const data = (await this.repository.update(
			{ id },
			{ is_active: true },
		)) as unknown as Entity;
		const responseMessages = [
			`${this.entityName} was activated`,
			`${this.entityName} был активирован`,
			`${this.entityName} faollashtirildi`,
		];
		const message = returnResponseMessage(responseMessages, lang);
		return {
			status_code: 200,
			message,
			data,
		};
	}

	async delete(id: string, lang: string, executer?: ExecuterEntity): Promise<IResponse<Entity>> {
		const data = (await this.repository.update(
			{ id },
			{
				is_deleted: true,
				is_active: false,
				deleted_by: executer,
				deleted_at: Date.now(),
			},
		)) as unknown as Entity;
		const message = responseByLang("delete", lang);
		return {
			status_code: 200,
			message,
			data,
		};
	}
}
