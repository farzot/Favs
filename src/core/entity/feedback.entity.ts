import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { UserEntity } from "./user.entity";

@Entity("feedbacks")
export class FeedbackEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public text!: string;

	@Column({ type: "int" })
	public rate!: number;

	@Column({ type: "simple-array", nullable: true })
	public images!: string[];

	@ManyToOne(() => ProductEntity, (product) => product.feedbacks)
	@JoinColumn({ name: "product_id" })
	public product!: ProductEntity;

	@ManyToOne(() => UserEntity, (user) => user.feedbacks)
	@JoinColumn({ name: "user_id" })
	public user!: UserEntity;
}
