import { IsBooleanString, IsOptional } from "class-validator";

export class FilterUserSelfOrderDto {
  @IsOptional()
  @IsBooleanString()
  public status!: string
}