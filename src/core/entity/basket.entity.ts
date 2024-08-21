import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ProductEntity } from "./product.entity";

@Entity("user_basket")
export class BasketEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(() => UserEntity, (user) => user.baskets)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@ManyToOne(() => ProductEntity, (product) => product.baskets)
	@JoinColumn({ name: "product_id" })
	product!: ProductEntity;

    @Column({type: "int"})
    amount!: number
}
