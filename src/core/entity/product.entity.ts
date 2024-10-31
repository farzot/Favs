import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { SmallCategoryEntity } from "./small-category.entity";
import { BasketEntity } from "./basket.entity";
import { OrderItemEntity } from "./order-item.entity";
import { FeedbackEntity } from "./feedback.entity";
import { ProductType } from "../../common/database/Enums";
import { ProductReviewEntity } from "./product_review.entity";
import { ExecuterEntity } from "./executer.entity";

@Entity("products")
export class ProductEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public name_uz!: string;

	@Column({ type: "varchar", nullable: true })
	public name_en!: string;

	@Column({ type: "varchar", nullable: true })
	public name_ru!: string;

	@Column({ type: "varchar", nullable: true })
	public description_uz!: string;

	@Column({ type: "varchar", nullable: true })
	public description_en!: string;

	@Column({ type: "varchar", nullable: true })
	public description_ru!: string;

	@Column({ type: "int" })
	public amount!: number;

	@Column({ type: "decimal", scale: 2, nullable: true })
	public price!: number;

	@Column({ type: "boolean", default: false, nullable: true })
	public discount!: boolean;

	@Column({ type: "decimal", default: 0, nullable: true })
	public discount_percent!: number;

	@Column({ type: "decimal", scale: 2, default: 0, nullable: true })
	public discount_price!: number;

	@Column({ type: "boolean", default: false, nullable: true })
	public is_popular!: boolean;

	@Column({ type: "boolean", default: false, nullable: true })
	public is_recomended!: boolean;

	@Column({ type: "simple-array", nullable: true })
	public images!: string[];

	@Column({ type: "enum", enum: ProductType })
	public type!: ProductType;

	@ManyToOne(() => SmallCategoryEntity, (category) => category.products)
	@JoinColumn({ name: "category_id" })
	public category!: SmallCategoryEntity;

	@OneToMany(() => BasketEntity, (basket) => basket.product)
	public baskets!: BasketEntity[];

	@OneToMany(() => OrderItemEntity, (order_item) => order_item.product)
	public order_items!: OrderItemEntity[];

	@OneToMany(() => FeedbackEntity, (feedback) => feedback.product)
	public feedbacks!: FeedbackEntity[];

	@OneToMany(() => ProductReviewEntity, (review) => review.product)
	public reviews!: ProductReviewEntity[];

	@ManyToOne(() => ExecuterEntity, (executer) => executer.id, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "created_by" })
	created_by!: ExecuterEntity;

	@ManyToOne(() => ExecuterEntity, (executer) => executer.id, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "updated_by" })
	updated_by!: ExecuterEntity;

	@ManyToOne(() => ExecuterEntity, (executer) => executer.id, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "deleted_by" })
	deleted_by!: ExecuterEntity;
}
