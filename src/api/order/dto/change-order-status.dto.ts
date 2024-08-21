import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "src/common/database/Enums";

export class ChangeOrderStatusDto {
  @IsNotEmpty()
  @IsEnum([OrderStatus.APPROVED, OrderStatus.DELIVERED])
  public status!: OrderStatus
}