import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { BigCategoryEntity } from "./big-category.entity";
import { BusinessEntity } from "./business.entity";
import { AddBusinessRequestEntity } from "./add-business-request.entity";

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

	@ManyToMany(() => BusinessEntity, (business) => business.categories)
	public businesses!: BusinessEntity[];

	@ManyToMany(() => AddBusinessRequestEntity, (request) => request.categories)
	public business_requests!: AddBusinessRequestEntity[];

	@ManyToOne(() => BigCategoryEntity, (category) => category.small_categories, { onDelete: "CASCADE" })
	@JoinColumn({ name: "big_category_id" })
	public big_category!: BigCategoryEntity;
}
