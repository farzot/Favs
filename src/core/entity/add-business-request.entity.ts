import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { SmallCategoryEntity } from "./small-category.entity";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessRequest } from "../../common/database/Enums";
import { ExecuterEntity } from "./executer.entity";

@Entity("add_business_request")
export class AddBusinessRequestEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public name!: string;

	@Column({ type: "varchar", nullable: true })
	public email!: string;

	@Column({ type: "varchar", nullable: true })
	public phone_number!: string;

	@Column({ type: "varchar", nullable: true })
	public website!: string;

	@Column({ type: "varchar", nullable: true })
	public street_adress!: string;

	@Column({ type: "varchar", nullable: true })
	public country!: string;

	@Column({ type: "varchar", nullable: true })
	public city!: string;

	@Column({ type: "varchar", nullable: true })
	public state!: string;

	@Column({ type: "varchar", nullable: true })
	public zip_code!: string;

	@Column({ type: "enum", enum: BusinessRequest, default: "pending" })
	public status!: BusinessRequest;

	@ManyToOne(() => ExecuterEntity, (user) => user.business, { onDelete: "CASCADE" })
	@JoinColumn({ name: "owner_id" })
	public owner!: ExecuterEntity;

	@ManyToMany(() => SmallCategoryEntity, (category) => category.business_requests)
	@JoinTable({
		name: "business_request_categories", // Ko'prik jadval nomi
		joinColumn: { name: "business_request_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
	})
	public categories!: SmallCategoryEntity[];

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
