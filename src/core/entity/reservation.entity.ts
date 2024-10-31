import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessEntity } from "./business.entity";
import { ExecuterEntity } from "./executer.entity";
import { ReservationStatus } from "../../common/database/Enums";
@Entity("reservations")
export class ReservationEntity extends BaseEntity {
	@Column({ type: "bigint", nullable: true })
	public reservation_time!: number;

	@Column({ type: "bigint", nullable: true })
	public reservation_expiration_time!: number;

	@Column({ type: "bigint", nullable: true })
	public number_of_guests!: number;

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

	@Column({ type: "decimal", nullable: true })
	public deposit_amount!: number; // Oldindan to'lov (opsional)

	@Column({ type: "enum", enum: ReservationStatus, nullable: true })
	public status!: ReservationStatus;

	@Column({ type: "decimal", nullable: true })
	public cancellation_fee!: number; // Bekor qilish jarimasi (opsional)

	@Column({ type: "varchar", nullable: true })
	public cancellation_reason!: string;

	@Column({ type: "bigint", nullable: true })
	public cancellation_time!: number;

	@Column({ type: "varchar", nullable: true })
	public confirmation_notes!: string;

	@Column({ type: "bigint", nullable: true })
	public confirmation_time!: number;

	@ManyToOne(() => ExecuterEntity, (executer) => executer.id, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "created_by" })
	created_by!: ExecuterEntity;

	@ManyToOne(() => ExecuterEntity, (executer) => executer.id, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "updated_by" })
	updated_by!: ExecuterEntity;

	@ManyToOne(() => ExecuterEntity, (executer) => executer.id, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "deleted_by" })
	deleted_by!: ExecuterEntity;
}
