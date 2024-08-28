import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { ExecuterEntity } from "./executer.entity";
@Entity("notifications")
export class NotificationEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public is_read!: string;

	@Column({ type: "varchar", nullable: true })
	public message!: string;

	@ManyToOne(() => ExecuterEntity, (user) => user.notifications)
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;
}
