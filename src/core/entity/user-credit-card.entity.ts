import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { OrderEntity } from "./order.entity";
import { BaseEntity } from "../../common/database/BaseEntity";

@Entity("user_credit_card")
export class UserCreditCardEntity extends BaseEntity {
	@Column({ type: "varchar" })
	public card_number!: string;

	@Column({ type: "varchar" })
	public expire_month!: string;

	@Column({ type: "varchar" })
	public expire_year!: string;

	@Column({ type: "varchar", nullable: true })
	public cvv!: string;

	@Column({ type: "boolean", nullable: true })
	public is_visa!: boolean;

	@ManyToOne(() => UserEntity, (user) => user.cards)
	@JoinColumn({ name: "user_id" })
	public user!: UserEntity;

	@OneToMany(() => OrderEntity, (order) => order.user_credit_card)
	public orders!: OrderEntity[];
}
