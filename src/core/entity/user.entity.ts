import { BaseEntity } from "src/common/database/BaseEntity";
import { Gender, Roles } from "src/common/database/Enums";
import { Column, Entity, Index, ManyToMany, OneToMany } from "typeorm";
import { BasketEntity } from "./basket.entity";
import { UserLocationEntity } from "./user-location.entity";
import { OrderEntity } from "./order.entity";
import { FeedbackEntity } from "./feedback.entity";
import { UserCreditCardEntity } from "./user-credit-card.entity";
import { ProductReviewEntity } from "./product_review.entity";
import { BusinessReviewEntity } from "./business_review.entity";
import { ReservationEntity } from "./reservation.entity";
import { NotificationEntity } from "./notification.entity";
import { CollectionsEntity } from "./collections.entity";
import { MessageEntity } from "./message.entity";
import { ChatEntity } from "./chat.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public first_name!: string;

	@Column({ type: "varchar", nullable: true })
	public last_name!: string;

	@Column({ type: "varchar", nullable: true })
	public username!: string;

	@Column({ type: "varchar" })
	public email!: string;

	@Column({ type: "varchar", nullable: true })
	public password!: string;

	@Column({ type: "varchar", nullable: true })
	public profile_picture!: string;

	@Column({ type: "varchar", nullable: true })
	public phone_number!: string;

	@Column({ type: "varchar", nullable: true })
	public gender!: Gender;

	@Column({ type: "varchar", nullable: true })
	public home_town!: string;

	@Column({ type: "varchar", nullable: true })
	public birth_date!: string;

	@Column({ type: "varchar", nullable: true })
	public blog_or_website!: string;

	@Column({ type: "varchar", nullable: true })
	public second_favourite_website!: string;

	@Column({ type: "varchar", nullable: true })
	public last_great_book_i_read!: string;

	@Column({ type: "varchar", nullable: true })
	public primary_language!: string;

	@Column({ type: "varchar", default: Roles.USER })
	public role!: Roles;

	@Column({ type: "varchar", nullable: true })
	public hashed_token!: string;

	@Column({ type: "varchar", nullable: true })
	public otp!: string;

	@Column({ type: "timestamp", nullable: true })
	public otp_expiration!: Date;

	@Column({ type: "int", default: 0 })
	public otp_request_count!: number;

	@Column({ type: "timestamp", nullable: true })
	public otp_blocked_until!: Date;

	@Column({ type: "int", nullable: true, default: 0 })
	public otp_blocked_duration!: number;

	@Column({ nullable: true })
	public google_id!: string;

	// @Column({ nullable: true })
	// public google_access_token!: string;

	@OneToMany(() => BasketEntity, (basket) => basket.user)
	public baskets!: BasketEntity[];

	@OneToMany(() => UserLocationEntity, (user_location) => user_location.user)
	public locations!: UserLocationEntity[];

	@OneToMany(() => OrderEntity, (order) => order.user)
	public orders!: OrderEntity[];

	@OneToMany(() => FeedbackEntity, (feedback) => feedback.user)
	public feedbacks!: FeedbackEntity[];

	@OneToMany(() => UserCreditCardEntity, (user_credit_card) => user_credit_card.user)
	public cards!: UserCreditCardEntity[];

	@OneToMany(() => ProductReviewEntity, (review) => review.user)
	public product_reviews!: ProductReviewEntity[];

	@OneToMany(() => BusinessReviewEntity, (review) => review.user)
	public business_reviews!: BusinessReviewEntity[];

	@OneToMany(() => ReservationEntity, (reservation) => reservation.user)
	public reservations!: ReservationEntity[];

	@OneToMany(() => NotificationEntity, (notification) => notification.user)
	public notifications!: NotificationEntity[];

	@OneToMany(() => CollectionsEntity, (collection) => collection.user)
	public collections!: CollectionsEntity[];

	@OneToMany(() => MessageEntity, (message) => message.sender)
	public messages!: MessageEntity[];

	@ManyToMany(() => ChatEntity, (chat) => chat.participants)
	public chats!: ChatEntity[];
}
