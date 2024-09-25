import { BaseEntity } from "../../common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PhotoType } from "../../common/database/Enums";
import { BusinessEntity } from "./business.entity";
import { ExecuterEntity } from "./executer.entity";

@Entity("business_photos")
export class BusinessPhotosEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public image_url!: string;

	@Column({ type: "enum", enum: PhotoType, default: PhotoType.ALL, nullable: false })
	public photo_type!: PhotoType;

	@Column({ type: "varchar", nullable: true })
	public caption!: string;

	@ManyToOne(() => BusinessEntity, (business) => business.photos)
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;

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
