import { BaseEntity } from "src/common/database/BaseEntity";
import { Gender, Roles } from "src/common/database/Enums";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
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
import { BusinessEntity } from "./business.entity";
import { FileEntity } from "./file.entity";
import { FriendshipEntity } from "./friendship.entity";
import { BlockEntity } from "./block-users.entity";

@Entity("executers")
export class ExecuterEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public first_name!: string;

	@Column({ type: "varchar", nullable: true })
	public last_name!: string;

	@Column({ type: "varchar", nullable: true, unique: true })
	public username!: string;

	@Column({ type: "varchar" })
	public email!: string;

	@Column({ type: "varchar", nullable: true })
	public password!: string;

	@Column({ type: "simple-array", nullable: true })
	public profile_picture!: string;

	@Column({ type: "varchar", nullable: true })
	public phone_number!: string;

	@Column({ type: "varchar", nullable: true })
	public gender!: Gender;

	@Column({ type: "varchar", nullable: true })
	public home_town!: string;

	@Column({ type: "bigint", nullable: true })
	public birth_date!: number;

	@Column({ type: "varchar", nullable: true })
	public my_blog_or_website!: string;

	@Column({ type: "varchar", nullable: true })
	public my_second_favourite_website!: string;

	@Column({ type: "varchar", nullable: true })
	public my_favourite_book!: string;

	@Column({ type: "varchar", nullable: true })
	public primary_language!: string;

	@Column({ type: "varchar", name: "role", default: Roles.USER })
	public role!: Roles;

	@Column({ type: "varchar", nullable: true })
	public hashed_token!: string;

	@Column({ type: "int", nullable: true })
	public google_id!: string;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_profile_private!: boolean;

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

	// @Column({ type: "simple-array", nullable: true })
	// public images!: string[];

	@OneToMany(() => BusinessEntity, (business) => business.owner)
	public business!: BusinessEntity[];

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

	@OneToMany(() => FriendshipEntity, (friendship) => friendship.requester)
	public sentFriendRequests!: FriendshipEntity[];

	@OneToMany(() => FriendshipEntity, (friendship) => friendship.addressee)
	public receivedFriendRequests!: FriendshipEntity[];

	@OneToMany(() => BlockEntity, (block) => block.blocker)
	public sentBlocks!: BlockEntity[];

	@OneToMany(() => BlockEntity, (block) => block.blocked)
	public receivedBlocks!: BlockEntity[];
}
