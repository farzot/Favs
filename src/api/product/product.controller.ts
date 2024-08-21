import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	Query,
	UploadedFiles,
	UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { multerImageUpload } from "src/infrastructure/lib/fileService";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { ProductQueryDto } from "./dto/query-product.dto";
import { ImageProductDto } from "./dto/image-product.dto";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { SmallCategoryService } from "../small_category/small_category.service";

@Controller("product")
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly categoryService: SmallCategoryService,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	@UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 4 }]))
	async createProduct(
		@Body() dto: CreateProductDto,
		@UploadedFiles()
		files: { images: Express.Multer.File[] },
		@CurrentLanguage() lang: string,
	) {
		return this.productService.createProduct(dto, files, lang);
	}

	// @Get("/all")
	// async getAllWithFilterProducts(
	// 	@CurrentLanguage() lang: string,
	// 	@Query() query: ProductQueryDto,
	// ) {
	// 	return await this.productService.getAllCategorizedProducts(query, lang);
	// }

	@Get()
	async getAllProducts(@CurrentLanguage() lang: string, @Query() query: ProductQueryDto) {
		return await this.productService.getAllProducts(lang, query);
	}

	@Get(":id")
	async getProductByID(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.productService.getProductByID(id, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	async updateProduct(
		@Param("id") id: string,
		@Body() dto: UpdateProductDto,
		@CurrentLanguage() lang: string,
	) {
		return this.productService.updateProduct(id, dto, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch("add-image/:id")
	@UseInterceptors(FileInterceptor("image", multerImageUpload))
	async addImageToProduct(
		@Param("id",) id: string,
		@UploadedFile() image: Express.Multer.File,
		@CurrentLanguage() lang: string,
	) {
		return this.productService.addImageToProduct(id, image, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch("remove-image/:id")
	async removeImageFromProduct(
		@Param("id") id: string,
		@Body() dto: ImageProductDto,
		@CurrentLanguage() lang: string,
	) {
		return this.productService.removeImageFromProduct(id, dto, lang);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Delete(":id")
	async deleteProduct(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.productService.deleteProduct(id, lang);
	}
}
