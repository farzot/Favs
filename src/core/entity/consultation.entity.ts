import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessEntity } from "./business.entity";
import { ConsultationStatus } from "../../common/database/Enums";
import { ExecuterEntity } from "./executer.entity";

;
@Entity("consultations")
export class ConsultationRequestEntity extends BaseEntity {
	@Column({ type: "varchar" })
	full_name!: string;

	@Column({ type: "varchar" })
	phone!: string;

	@Column({ type: "varchar", nullable: true })
	comment!: string;

	@Column({ type: "enum", enum: ConsultationStatus, default: ConsultationStatus.PENDING })
	public status!: ConsultationStatus;

	@ManyToOne(() => BusinessEntity, (business) => business.consultations, { onDelete: "CASCADE" })
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;

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