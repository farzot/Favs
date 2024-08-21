import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { UserEntity } from './user.entity';
@Entity("notifications")
export class NotificationEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public is_read!: string;

	@Column({ type: "varchar", nullable: true })
	public message!: string;

	@ManyToOne(() => UserEntity, (user) => user.notifications)
	@JoinColumn({ name: "user_id" })
	public user!: UserEntity;
}
