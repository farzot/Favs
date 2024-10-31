import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { ExecuterEntity } from "./executer.entity";
@Entity("notifications")
export class NotificationEntity extends BaseEntity {
	@Column({ type: "boolean", default: false })
	public is_read!: boolean;

	@Column({ type: "text", nullable: true })
	public message!: string;

	@Column({ type: "text", nullable: true })
	public title!: string;

	@ManyToOne(() => ExecuterEntity, (user) => user.notifications)
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;
}
