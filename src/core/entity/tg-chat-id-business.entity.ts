import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BusinessEntity } from "./business.entity";
import { TelegramTopicIDEntity } from "./tg-topic-id-business.entity";

@Entity("telegram_chat_id")
export class TelegramChatIDEntity extends BaseEntity {
	@Column({ type: "varchar", unique: true })
	public chat_id!: string;

	@ManyToOne(() => BusinessEntity, (business) => business.chat_ids, {
		onDelete: "CASCADE",
		nullable: true,
	})
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;

	@OneToMany(() => TelegramTopicIDEntity, (topic) => topic.chat_id)
	public topic_ids!: TelegramTopicIDEntity[];
}
