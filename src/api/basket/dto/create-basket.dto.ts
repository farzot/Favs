import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { ObjDto } from "src/common/type";

export class CreateBasketDto {
  @IsNotEmpty()
  @ValidateNested({each: true})
  @Type(() => ObjDto)
  readonly product!: ObjDto

  @IsNotEmpty()
  @IsNumber()
  readonly amount!: number
}

export class CreateMultipleBasketDto {
  @IsNotEmpty()
  @ValidateNested({each: true})
  @Type(() => CreateBasketDto)
  public basket!: CreateBasketDto[]
}
