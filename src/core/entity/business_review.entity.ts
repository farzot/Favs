import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessEntity } from "./business.entity";
import { ExecuterEntity } from "./executer.entity";
@Entity("business_reviews")
export class BusinessReviewEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public text!: string;

	@Column({ type: "int", nullable: true })
	public rating!: number;

	@ManyToOne(() => BusinessEntity, (business) => business.reviews, { onDelete: "CASCADE" })
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;

	@ManyToOne(() => ExecuterEntity, (user) => user.business_reviews, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;
}
