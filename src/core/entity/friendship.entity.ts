import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ExecuterEntity } from "./executer.entity";
import { BaseEntity } from "src/common/database/BaseEntity";

@Entity("friendships")
export class FriendshipEntity extends BaseEntity {
	@ManyToOne(() => ExecuterEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "requester_id" })
	public requester!: ExecuterEntity; // Friend request qilgan user

	@ManyToOne(() => ExecuterEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "addressee_id" })
	public addressee!: ExecuterEntity; // Friend request olgan user

	@Column({ type: "boolean", default: false })
	public is_accepted!: boolean; // Do'stlik tasdiqlanganmi yoki yo'q
}
