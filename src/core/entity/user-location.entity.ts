import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ExecuterEntity } from "./executer.entity";
import { BaseEntity } from "src/common/database/BaseEntity";

@Entity("user_locations")
export class UserLocationEntity extends BaseEntity {
	@Column({ type: "varchar", length: 20, nullable: true })
	public name_of_address!: string;

	@Column({ type: "varchar", length: 64, nullable: false })
	public country!: string;

	@Column({ type: "varchar", nullable: false })
	public city!: string;

	@Column({ type: "varchar", nullable: false })
	public street!: string;

	@Column({ type: "varchar", nullable: false })
	public state!: string;

	@Column({ type: "varchar", nullable: false, default: "+99899" })
	public phone_number!: string;

	@Column({ type: "float", nullable: true })
	latitude!: number;

	@Column({ type: "float", nullable: true })
	longitude!: number;

	@Column({ type: "varchar", length: 10, nullable: false })
	public zip_code!: string;

	@ManyToOne(() => ExecuterEntity, (user) => user.locations)
	@JoinColumn({ name: "user_id" })
	public user!: ExecuterEntity;

	@Column({ type: "boolean", default: true })
	public is_main!: boolean;

	@OneToMany(() => OrderEntity, (order) => order.user_location)
	public orders!: OrderEntity[];
}
