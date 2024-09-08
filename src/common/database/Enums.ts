enum CategorySize {
	BIG = "big",
	SMALL = "small",
}

export enum Roles {
	SUPER_ADMIN = "super_admin",
	ADMIN = "admin",
	USER = "user",
	BUSINESS_OWNER = "business_owner",
	BUSINESS_MANAGER = "business_manager",
	BUSINESS_STORE_ADMIN = "business_store_admin",
	BUSINESS_STORE_MANAGER = "business_store_manager",
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
    MAIN = "main",
}

export enum BusinessRequest {
	WAITING_FOR_APPROVAL = "pending",
	ACCEPTED = "accepted",
	REJECTED = "rejected",
}
