import { Entity, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../../common/database/BaseEntity";
import { BusinessReviewEntity } from "./business_review.entity";
import { ReservationEntity } from "./reservation.entity";
import { CollectionsEntity } from "./collections.entity";
import { BusinessPhotosEntity } from "./business-photos.entity";
import { SmallCategoryEntity } from "./small-category.entity";
import { ExecuterEntity } from "./executer.entity";
import { ConsultationRequestEntity } from "./consultation.entity";
import { BusinessScheduleEntity } from "./business_schedule.entity";
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
	public street_adress!: string;

	// @Column({ type: "varchar", nullable: true })
	// public country!: string;

	@Column({ type: "varchar", nullable: true })
	public city!: string;

	@Column({ type: "varchar", nullable: true })
	public state!: string;

	@Column({ type: "varchar", nullable: true })
	public extra_info!: string;

	@Column({ type: "varchar", nullable: true })
	public zip_code!: string;

	@Column({ type: "decimal", nullable: true })
	public latitude!: number;

	@Column({ type: "decimal", nullable: true })
	public longitude!: number;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_claimed!: boolean;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_delivery_available!: boolean;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_checkout_available!: boolean;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_reservation_available!: boolean;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_wifi_available!: boolean;

	@Column({ type: "boolean", nullable: true, default: false })
	public is_recommended!: boolean;

	@Column({ type: "decimal", nullable: true, default: 0 })
	public balance!: number;

	@Column({ type: "decimal", nullable: true, default: 0 })
	public average_star!: number;

	@Column({ type: "decimal", nullable: true, default: 0 })
	public reviews_count!: number;

	@Column({ type: "simple-array", nullable: true })
	public images_videos!: string[];

	@Column({ type: "simple-array", nullable: true })
	public company_documents!: string[];

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

	@ManyToOne(() => ExecuterEntity, (owner) => owner.business, { onDelete: "CASCADE" })
	@JoinColumn({ name: "owner_id" })
	public owner!: ExecuterEntity;

	@ManyToMany(() => SmallCategoryEntity, (category) => category.businesses)
	@JoinTable({
		name: "business_categories", // Ko'prik jadval nomi
		joinColumn: { name: "business_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
	})
	public categories!: SmallCategoryEntity[];

	@OneToMany(() => BusinessReviewEntity, (review) => review.business)
	public reviews!: BusinessReviewEntity[];

	@OneToMany(() => ConsultationRequestEntity, (consultation) => consultation.business)
	public consultations!: ConsultationRequestEntity[];

	@OneToMany(() => ReservationEntity, (reservation) => reservation.business)
	public reservations!: ReservationEntity[];

	@OneToMany(() => CollectionsEntity, (collection) => collection.business)
	public collections!: CollectionsEntity[];

	@OneToMany(() => BusinessPhotosEntity, (photo) => photo.business)
	public photos!: BusinessPhotosEntity[];

	@OneToMany(() => BusinessScheduleEntity, (schedule) => schedule.business)
	public schedules!: BusinessScheduleEntity[];
}
