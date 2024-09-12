import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";
import { ExecuterEntity } from "./executer.entity";

@Entity("user_basket")
export class BasketEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(() => ExecuterEntity, (user) => user.baskets)
	@JoinColumn({ name: "user_id" })
	user!: ExecuterEntity;

	@ManyToOne(() => ProductEntity, (product) => product.baskets)
	@JoinColumn({ name: "product_id" })
	product!: ProductEntity;

	@Column({ type: "int" })
	amount!: number;
}
