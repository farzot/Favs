import { BaseEntity } from "../../common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PhotoType } from "../../common/database/Enums";
import { BusinessEntity } from "./business.entity";

@Entity("business_photos")
export class BusinessPhotosEntity extends BaseEntity {
    @Column({ type: "varchar", nullable: true })
    public image!: string;

    @Column({ type: "varchar", nullable: true })
    public photo_type!: PhotoType;

    @Column({ type: "varchar", nullable: true })
    public caption!: string;

    @ManyToOne(() => BusinessEntity, (business) => business.photos)
    @JoinColumn({name: "business_id"})
    public business!: BusinessEntity;
}