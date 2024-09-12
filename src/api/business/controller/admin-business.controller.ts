import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
} from "@nestjs/common";
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
import { CurrentExecuter } from '../../../common/decorator/current-user';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("/admin/business")
export class AdminBusinessController {
	constructor(private readonly businessService: AdminBusinessService) {}

	//create business
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	public async create(
		@Body() dto: CreateBusinessDto,
		@CurrentLanguage() lang: string,
		@CurrentExecuter() executerPayload: ICurrentExecuter,
	) {
		return this.businessService.createBusiness(dto, lang, executerPayload.executer);
	}

	// gett all business with filter
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("/all")
	async findAll(
		@CurrentLanguage() lang: string,
		@Query() query: FilterDto,
	): Promise<IResponse<BusinessEntity[]>> {
		return await this.businessService.findAllBusiness(lang, query);
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
