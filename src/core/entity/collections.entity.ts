import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { BusinessEntity } from './business.entity';
import { UserEntity } from './user.entity';

@Entity("collections")
export class CollectionsEntity extends BaseEntity {
	@ManyToOne(() => UserEntity, (user) => user.collections)
	@JoinColumn({ name: "user_id" })
	public user!: UserEntity;

	@ManyToOne(() => BusinessEntity, (business) => business.collections)
	@JoinColumn({ name: "business_id" })
	public business!: BusinessEntity;
}
