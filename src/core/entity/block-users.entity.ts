import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ExecuterEntity } from "./executer.entity";
import { BaseEntity } from "src/common/database/BaseEntity";

@Entity("blocks")
export class BlockEntity extends BaseEntity {
	@ManyToOne(() => ExecuterEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "blocker_id" })
	public blocker!: ExecuterEntity; // Foydalanuvchini bloklagan user

	@ManyToOne(() => ExecuterEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "blocked_id" })
	public blocked!: ExecuterEntity; // Bloklangan user

	@Column({ type: "boolean", default: true })
	public is_active!: boolean; // Blok aktivligi holati
}
