export enum ReservationStatus {
	PENDING = "pending",
	NO_SHOW = "no_show", // Kelmagan
	CANCELLED = "cancelled", // Bekor qilingan
	CONFIRMED = "confirmed", // Tasdiqlangan
	CHECKED_IN = "checked-in", // Tizimga kirdi yoki joy egallandi
	COMPLETED = "completed", // Tugallangan
	EXPIRED = "expired", // Muddati tugagan
	WAITLIST = "waiting list", // Navbat ro'yxatida
	FAILED = "failed", // Muvaffaqiyatsiz
}

export enum Roles {
	SUPER_ADMIN = "super_admin",
	ADMIN = "admin",
	USER = "user",
	BUSINESS_OWNER = "business_owner",
	BUSINESS_MANAGER = "business_manager",
	// BUSINESS_STORE_ADMIN = "business_store_admin",
	// BUSINESS_STORE_MANAGER = "business_store_manager",
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

export enum ConsultationStatus {
	PENDING = "pending",
	REJECTED = "rejected",
	ACCEPTED = "accepted",
}

export enum ProductType {
	AUTHOR = "author",
	IN_STOCK = "in_stock",
}

export enum PhotoType {
	INSIDE = "inside",
	OUTSIDE = "outside",
	ALL = "all",
	PRODUCTS = "products",
	BANNER = "banner",
	LOGO = "logo",
	MAIN = "main",
}

export enum BusinessRequest {
	WAITING_FOR_APPROVAL = "pending",
	ACCEPTED = "accepted",
	REJECTED = "rejected",
}

export enum TopicType {
	ORDER = "order",
	CONTACT_US = "consultation",
	NEWS = "news",
	FEEDBACK = "feedback",
	CHAT = "chat",
	RESERVATION = "reservation",
	FOLLOWERS = "followers",
}