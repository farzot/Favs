import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessEntity } from "./business.entity";
import { ExecuterEntity } from "./executer.entity";
@Entity("reservations")
export class ReservationEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public reservation_time!: string;

	@Column({ type: "varchar", nullable: true })
	public details!: string;

	@Column({ type: "varchar", nullable: true })
	public guest_name!: string;

	@Column({ type: "varchar", nullable: true })
	public guest_phone!: string;

	@Column({ type: "varchar", nullable: true })
	public guest_email!: string;

	@ManyToOne(() => BusinessEntity, (business) => business.reservations, { onDelete: "CASCADE" })
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;

	@ManyToOne(() => ExecuterEntity, (user) => user.reservations, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;
}
