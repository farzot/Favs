import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessEntity } from "./business.entity";
import { ExecuterEntity } from "./executer.entity";

@Entity("collections")
export class CollectionsEntity extends BaseEntity {
	@ManyToOne(() => ExecuterEntity, (user) => user.collections)
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;

	@ManyToOne(() => BusinessEntity, (business) => business.collections)
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;

	@Column({ type: "varchar" })
	public name!: string;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_private!: boolean;
}
