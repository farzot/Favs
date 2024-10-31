import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { ExecuterEntity } from "./executer.entity";
@Entity("payment")
export class PaymentEntity extends BaseEntity {
	@Column({ type: "boolean", default: false })
	public sum!: boolean;

	@Column({ type: "varchar", nullable: true })
	public message!: string;

	@Column({ type: "varchar", nullable: true })
	public title!: string;

	// @ManyToOne(() => ExecuterEntity, (user) => user.notifications)
	// @JoinColumn({ name: "user_id" })
	// public user!: ExecuterEntity;
}
