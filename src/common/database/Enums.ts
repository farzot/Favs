enum CategorySize {
	BIG = "big",
	SMALL = "small",
}

export enum Roles {
	SUPER_ADMIN = "super_admin",
	ADMIN = "admin",
	USER = "user",
	// BUSINESS_OWNER = "business_owner",
	// BUSINESS_MANAGER = "business_manager",
}

export enum Gender {
	MAN = "man",
	WOMAN = "woman",
	OTHER = "other",
}

export enum OrderStatus {
	PENDING = "pending",
	APPROVED = "approved",
	DELIVERED = "delivered",
	FINISHED = "finished",
	CANCELLED = "cancelled",
}

export enum ProductType {
	AUTHOR = "author",
	IN_STOCK = "in_stock",
}

export enum PhotoType{
	INSIDE = "inside",
	OUTSIDE = "outside",
	ALL= "all",
	BANNER = "banner",
	LOGO = "logo",
	COVER = "cover",
    THUMBNAIL = "thumbnail",
    MAIN = "main",
}

export { CategorySize };
