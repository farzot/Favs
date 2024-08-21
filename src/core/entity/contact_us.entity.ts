import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity("contact_us")
export class ContactUsEntity extends BaseEntity {
	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "varchar" })
	phone!: string;

	@Column({ type: "varchar", nullable: true })
	message!: string;
}
