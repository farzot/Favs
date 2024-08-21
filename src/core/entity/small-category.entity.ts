import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { BigCategoryEntity } from "./big-category.entity";

@Entity("small_categories")
export class SmallCategoryEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public name_uz!: string;

	@Column({ type: "varchar", nullable: true })
	public name_ru!: string;

	@Column({ type: "varchar", nullable: true })
	public name_en!: string;

	@Column({ type: "varchar", nullable: true })
	public description_uz!: string;

	@Column({ type: "varchar", nullable: true })
	public description_en!: string;

	@Column({ type: "varchar", nullable: true })
	public description_ru!: string;

	@OneToMany(() => ProductEntity, (product) => product.category)
	public products!: ProductEntity[];

	@ManyToOne(() => BigCategoryEntity, (category) => category.small_categories)
	@JoinColumn({ name: "big_category_id" })
	public category!: BigCategoryEntity;
}
