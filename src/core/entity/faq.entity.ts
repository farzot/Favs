import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity("faq")
export class FaqEntity extends BaseEntity {
	@Column({ type: "varchar", default: "?" })
	question_uz!: string;

	@Column({ type: "varchar", default: "?" })
	question_ru!: string;

	@Column({ type: "varchar", default: "?" })
	question_en!: string;

	@Column({ type: "varchar", default: "?" })
	answer_uz!: string;

	@Column({ type: "varchar", default: "?" })
	answer_ru!: string;

	@Column({ type: "varchar", default: "?" })
	answer_en!: string;
}
