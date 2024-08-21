import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { BusinessReviewEntity } from './business_review.entity';
import { ReservationEntity } from './reservation.entity';
import { CollectionsEntity } from './collections.entity';
import { BusinessPhotosEntity } from './business-photos.entity';
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

	@Column({ type: "varchar", nullable: true })
	public category_id!: string;

	@OneToMany(() => BusinessReviewEntity, (review) => review.business)
	public reviews!: BusinessReviewEntity[];

	@OneToMany(() => ReservationEntity, (reservation) => reservation.business)
	public reservations!: ReservationEntity[];

	@OneToMany(() => CollectionsEntity, (collection) => collection.business)
	public collections!: CollectionsEntity[];

	@OneToMany(() => BusinessPhotosEntity, (photo) => photo.business)
	public photos!: BusinessPhotosEntity[];
}