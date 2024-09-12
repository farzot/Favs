import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class SendSMSDto {
  @IsNotEmpty()
  @IsString()
  public message!: string;

  @IsNotEmpty()
  @IsString()
  public phone_number!: string;
}