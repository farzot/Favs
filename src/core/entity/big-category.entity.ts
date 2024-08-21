import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { SmallCategoryEntity } from "./small-category.entity";

@Entity("big_categories")
export class BigCategoryEntity extends BaseEntity {
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

	@OneToMany(() => SmallCategoryEntity, (small_category) => small_category.category)
	public small_categories!: SmallCategoryEntity[];
}
