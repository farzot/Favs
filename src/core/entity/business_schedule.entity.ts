import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessEntity } from "./business.entity";

@Entity("business_schedule")
export class BusinessScheduleEntity extends BaseEntity {
	@Column({ type: "varchar" })
	public day_of_week!: string; // Dushanba, Seshanba va hokazo.

	@Column({ type: "time", nullable: true })
	public opening_time!: string;

	@Column({ type: "time", nullable: true })
	public closing_time!: string;

	@ManyToOne(() => BusinessEntity, (business) => business.schedules, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;
}
