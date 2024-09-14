import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto{
    @IsNotEmpty()
    @IsString()
    readonly new_password!: string;
    
    @IsNotEmpty()
    @IsString()
    readonly confirm_password!: string;
}