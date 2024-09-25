import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ShareBusiness {
	sender!: string;
	business_name!: string;
	business_link!: string;
	business_image!: string;
	message!: string;
	business_rating!: number;
	business_reviews!: number;
	business_categories!: string;
	recipient_email!: string;
	email_preferences_link!: string;
	sender_link!: string;
}

export class ShareBusinessDto {
	@IsNotEmpty()
	@IsUUID()
	business_id!:string;

	@IsOptional()
	@IsString()
    message!: string;

	@IsNotEmpty()
    @IsString()
    recipient_email!: string;
}


