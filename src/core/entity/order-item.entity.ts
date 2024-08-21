import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "./product.entity";

@Entity("order_items")
export class OrderItemEntity extends BaseEntity {
	@Column({ type: "varchar", default: "go en" })
	public product_name_en!: string;

	@Column({ type: "varchar", default: "go ru" })
	public product_name_ru!: string;

	@Column({ type: "varchar", default: "go uz" })
	public product_name_uz!: string;

	@Column({ type: "int2" })
	public amount!: number;

	@Column({ type: "decimal", scale: 2 })
	public price!: number;

	@Column({ type: "decimal", scale: 2,nullable:true })
	public given_discount!: number;

	@Column({ type: "decimal", scale: 2 })
	public to_pay!: number;

	@ManyToOne(() => OrderEntity, (order) => order.order_items)
	@JoinColumn({ name: "order_id" })
	public order!: OrderEntity;

	@ManyToOne(() => ProductEntity, (product) => product.order_items)
	@JoinColumn({ name: "product_id" })	
	public product!: ProductEntity;
}
