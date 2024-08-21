import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity("banners")
export class BannerEntity extends BaseEntity {
	@Column({ type: "varchar" })
	banner_file!: string;
}
