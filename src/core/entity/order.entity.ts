import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserLocationEntity } from "./user-location.entity";
import { OrderItemEntity } from "./order-item.entity";
import { OrderStatus } from "src/common/database/Enums";
import { UserCreditCardEntity } from "./user-credit-card.entity";
import { ExecuterEntity } from "./executer.entity";

@Entity("orders")
export class OrderEntity extends BaseEntity {
	@Column({ type: "varchar" })
	public check_number!: string;

	@Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
	public status!: OrderStatus;

	@Column({ type: "decimal", scale: 2 })
	public total_price!: number;

	@Column({ type: "decimal", scale: 2, default: 0 })
	public given_discount!: number;

	@Column({ type: "varchar", nullable: true })
	public promocode!: string;

	@Column({ type: "int", nullable: true })
	public promo_percent!: number;

	@Column({ type: "decimal", scale: 2 })
	public total_to_pay!: number;

	@ManyToOne(() => ExecuterEntity, (user) => user.orders)
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;

	@ManyToOne(() => UserLocationEntity, (user_location) => user_location.orders)
	@JoinColumn({ name: "user_location_id" })
	public user_location!: UserLocationEntity;

	@ManyToOne(() => UserCreditCardEntity, (user_credit_card) => user_credit_card.orders)
	@JoinColumn({ name: "user_credit_card_id" })
	public user_credit_card!: UserCreditCardEntity;

	@OneToMany(() => OrderItemEntity, (order_item) => order_item.order)
	public order_items!: OrderItemEntity[];

}
