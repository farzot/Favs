import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessReviewEntity } from "./business_review.entity";
import { ReservationEntity } from "./reservation.entity";
import { CollectionsEntity } from "./collections.entity";
import { BusinessPhotosEntity } from "./business-photos.entity";
import { SmallCategoryEntity } from "./small-category.entity";
import { ExecuterEntity } from "./executer.entity";
@Entity("business")
export class BusinessEntity extends BaseEntity {
	@Column({ type: "varchar", nullable: true })
	public name!: string;

	@Column({ type: "varchar", nullable: true })
	public email!: string;

	@Column({ type: "varchar", nullable: true })
	public phone_number!: string;

	@Column({ type: "varchar", nullable: true })
	public website!: string;

	@Column({ type: "varchar", nullable: true })
	public stir_number!: string;

	@Column({ type: "varchar", nullable: true })
	public address_name!: string;

	@Column({ type: "varchar", nullable: true })
	public country!: string;

	@Column({ type: "varchar", nullable: true })
	public city!: string;

	@Column({ type: "varchar", nullable: true })
	public state!: string;

	@Column({ type: "varchar", nullable: true })
	public street!: string;

	@Column({ type: "varchar", nullable: true })
	public latitude!: string;

	@Column({ type: "varchar", nullable: true })
	public longitude!: string;

	@Column({ type: "varchar", nullable: true })
	public owner_id!: string;

	@ManyToOne(() => ExecuterEntity, (owner) => owner.business, { onDelete: "CASCADE" })
	@JoinColumn({ name: "owner_id" })
	public owner!: ExecuterEntity;

	@ManyToOne(() => SmallCategoryEntity, (category) => category.business, { onDelete: "CASCADE" })
	@JoinColumn({ name: "category_id" })
	public category!: SmallCategoryEntity;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_claimed!: boolean;

	// @ManyToOne(() => BusinessEntity, (business) => business.reviews, { onDelete: "CASCADE" })
	// @JoinColumn({ name: "business_id" })
	// public business!: BusinessEntity;

	@OneToMany(() => BusinessReviewEntity, (review) => review.business)
	public reviews!: BusinessReviewEntity[];

	@OneToMany(() => ReservationEntity, (reservation) => reservation.business)
	public reservations!: ReservationEntity[];

	@OneToMany(() => CollectionsEntity, (collection) => collection.business)
	public collections!: CollectionsEntity[];

	@OneToMany(() => BusinessPhotosEntity, (photo) => photo.business)
	public photos!: BusinessPhotosEntity[];
}
