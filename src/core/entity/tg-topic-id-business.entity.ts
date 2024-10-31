import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TelegramChatIDEntity } from "./tg-chat-id-business.entity";
import { TopicType } from "../../common/database/Enums";

@Entity("telegram_chat_topic_id")
export class TelegramTopicIDEntity extends BaseEntity {
	@Column({ type: "varchar"})
	public topic_id!: string;

	@ManyToOne(() => TelegramChatIDEntity, (chat_id) => chat_id.topic_ids, { onDelete: "CASCADE" })
	@JoinColumn({ name: "telegram_chat_id" })
	public chat_id!: TelegramChatIDEntity;

	@Column({ type: "enum", enum: TopicType, nullable: true })
	public type!: TopicType;
}
