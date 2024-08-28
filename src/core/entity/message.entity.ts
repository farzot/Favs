import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { ExecuterEntity } from "./executer.entity";
import { ChatEntity } from "./chat.entity";
@Entity("messages")
export class MessageEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public content!: string;

	@ManyToOne(() => ExecuterEntity, (user) => user.messages, { onDelete: "SET NULL" })
	@JoinColumn({ name: "sender_id" })
	public sender!: ExecuterEntity;

	// Column({ type: "timestamp", nullable: true })
	// public read_at!: Date;@

	@ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: "CASCADE" })
	@JoinColumn({ name: "chat_id" })
	public chat!: ChatEntity;
}
