import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { ProductEntity } from "./product.entity";
import { ExecuterEntity } from "./executer.entity";
@Entity("product_review")
export class ProductReviewEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public review_text!: string;

	@Column({ type: "varchar", nullable: true })
	public rating!: number;

	@ManyToOne(() => ProductEntity, (product) => product.reviews, { onDelete: "CASCADE" })
	@JoinColumn({ name: "product_id" })
	public product!: ProductEntity;

	@ManyToOne(() => ExecuterEntity, (user) => user.product_reviews, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;
}
