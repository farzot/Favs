import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

class CategoryOrderItems{
  @IsNotEmpty()
  @IsNumber()
  public id!: number

  @IsNotEmpty()
  @IsNumber()
  public order!: number
}

export class ChangeCategoryOrder {
  @IsNotEmpty()
  @ValidateNested({each: true})
  @Type(() => CategoryOrderItems)
  public category_order!: CategoryOrderItems[]
}