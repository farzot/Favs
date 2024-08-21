import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity("promocode")
export class PromoCodeEntity extends BaseEntity {
	@Column({ type: "varchar", unique: true })
	public promocode!: string;

	@Column({ type: "int" })
	public percentage!: number;
}
