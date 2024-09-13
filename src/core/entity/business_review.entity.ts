import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessEntity } from "./business.entity";
import { ExecuterEntity } from "./executer.entity";
import { MinLength } from "class-validator";
@Entity("business_reviews")
export class BusinessReviewEntity extends BaseEntity {
	@Column({ type: "varchar" })
	@MinLength(25)
	public text!: string;

	@Column({ type: "int" })
	public rating!: number;

	@Column({ type: "int", nullable: true, default: 0 })
	public like!: number;

	@Column({ type: "int", nullable: true, default: 0 })
	public dislike!: number;

	@Column({ type: "simple-array", nullable: true })
	public images!: string[];

	@ManyToOne(() => BusinessEntity, (business) => business.reviews, { onDelete: "CASCADE" })
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;

	@ManyToOne(() => ExecuterEntity, (user) => user.business_reviews, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;
}
