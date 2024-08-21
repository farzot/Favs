import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "src/common/database/Enums";
import { FilterDto } from "src/common/dto/filter.dto";

export class FilterOrderDto extends FilterDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  public status!: boolean
}