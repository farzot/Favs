import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { SmallCategoryEntity } from "./small-category.entity";
import { ExecuterEntity } from "./executer.entity";

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

	@OneToMany(() => SmallCategoryEntity, (small_category) => small_category.big_category)
	public small_categories!: SmallCategoryEntity[];

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
