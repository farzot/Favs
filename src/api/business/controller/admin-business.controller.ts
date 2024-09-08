import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common";
import { AdminBusinessService } from "../service/admin-business.service";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { AddBusinessRequestDto } from "../dto/add-business-request.dto";
import { CurrentLanguage } from "../../../common/decorator/current-language";
import { ICurrentExecuter } from "../../../common/interface/current-executer.interface";
import { FilterDto } from "../../../common/dto/filter.dto";
import { IResponse } from "../../../common/type";
import { BusinessEntity } from "../../../core/entity";
import { FindOptionsWhereProperty, ILike } from "typeorm";
import { responseByLang } from "../../../infrastructure/lib/prompts/successResponsePrompt";
import { JwtAuthGuard } from "../../auth/user/AuthGuard";
import { RolesGuard } from "../../auth/roles/RoleGuard";
import { RolesDecorator } from "../../auth/roles/RolesDecorator";
import { Roles } from "../../../common/database/Enums";

@Controller("/admin/business")
export class AdminBusinessController {
	constructor(private readonly businessService: AdminBusinessService) {}

	// add-business-request api, business create qilish uchun jo'natiladigan request
	// @Post("/add-business-request")
	// public async addBusinessRequest(
	// 	@Body() dto: AddBusinessRequestDto,
	// 	@CurrentLanguage() lang: string,
	// 	executerPayload: ICurrentExecuter,
	// ) {
	// 	return this.businessService.addBusinessRequest(dto, lang, executerPayload.executer);
	// }

	//create business
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	public async create(
		@Body() dto: CreateBusinessDto,
		@CurrentLanguage() lang: string,
		executerPayload: ICurrentExecuter,
	) {
		return this.businessService.createBusiness(dto, lang, executerPayload.executer);
	}

	// gett all business with filter
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get("/all")
	async findAll(
		@CurrentLanguage() lang: string,
		@Query() query: FilterDto,
	): Promise<IResponse<BusinessEntity[]>> {
		let where_condition: FindOptionsWhereProperty<BusinessEntity> = {};
		if (query?.search) {
			where_condition = [
				{
					name: ILike(`%${query.search}%`),
					is_deleted: false,
				},
			];
		}
		let { data: categories } = await this.businessService.findAllWithPagination(lang, {
			take: query.page_size,
			skip: query.page,
			where: where_condition,
			relations: {},
			order: { created_at: "DESC" },
		});
		// categories = this.businessService.filterCategoryByLang(categories, lang);
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: categories, message };
	}

	// @Get()
	// findAll() {
	//   return this.businessService.findAll();
	// }

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	//   return this.businessService.findOne(+id);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
	//   return this.businessService.update(+id, updateBusinessDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.businessService.remove(+id);
	// }
}
