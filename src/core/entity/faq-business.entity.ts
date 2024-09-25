import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BusinessEntity } from "./business.entity";

@Entity("faq_business")
export class FaqBusinessEntity extends BaseEntity {
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

	@ManyToOne(() => BusinessEntity, (business) => business.business_faqs)
	business!: BusinessEntity;
}
