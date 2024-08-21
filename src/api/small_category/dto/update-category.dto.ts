import { PartialType } from "@nestjs/mapped-types";
import { CreateSmallCategoryDto } from "./create-category.dto";

export class UpdateSmallCategoryDto extends PartialType(CreateSmallCategoryDto) {}
