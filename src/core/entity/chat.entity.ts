import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { UserEntity } from "./user.entity";
import { MessageEntity } from "./message.entity";
@Entity("chats")
export class ChatEntity extends BaseEntity {
	@Column({ type: "boolean", default: false })
	public is_group!: boolean;

	// @ManyToOne(() => UserEntity, (user) => user.messages)
	// public sender!: UserEntity;

	// @ManyToOne(() => UserEntity, (user) => user.received_messages)
	// recipient!: UserEntity;

	@Column({ type: "timestamp", nullable: true })
	read_at!: Date;

	@ManyToMany(() => UserEntity, (user) => user.chats)
	@JoinTable()
	public participants!: UserEntity[];

	@OneToMany(() => MessageEntity, (message) => message.chat)
	public messages!: MessageEntity[];
}
