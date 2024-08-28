import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { MessageEntity } from "./message.entity";
import { ExecuterEntity } from "./executer.entity";
@Entity("chats")
export class ChatEntity extends BaseEntity {
	// @Column({ type: "boolean", default: false })
	// public is_group!: boolean;

	// @Column({ type: "timestamp", nullable: true })
	// read_at!: Date;

	@ManyToMany(() => ExecuterEntity, (user) => user.chats)
	@JoinTable()
	public participants!: ExecuterEntity[];

	@OneToMany(() => MessageEntity, (message) => message.chat)
	public messages!: MessageEntity[];
}
