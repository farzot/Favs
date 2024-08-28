import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';

@Entity("followers")
export class FollowersEntity extends BaseEntity {
    // @Column({ type: "integer" })
    // public user_id!: number;
    
    // @Column({ type: "integer" })
    // public follower_id!: number;
    
    // @ManyToOne(() => UserEntity, (user) => user.followers)
    // public user!: UserEntity;
    
    // @ManyToOne(() => UserEntity, (follower) => follower.followings)
    // public follower!: UserEntity;
}
