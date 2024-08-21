import { BaseEntity } from "src/common/database/BaseEntity";
import { Roles } from "src/common/database/Enums";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column({type: 'varchar', length: 64})
  public fullname!: string

  @Index({unique: true, where: ("is_deleted = false")})
  @Column({type: 'varchar', length: 20})
  public username!: string

  @Column({type: 'varchar'})
  public email!: string;

  @Column({type: 'varchar'})
  public phone_number!: string;


  @Column({type: 'varchar',})
  public password!: string

  @Column({type: 'enum', enum: [Roles.SUPER_ADMIN, Roles.ADMIN],  default: Roles.ADMIN})
  public role!: [Roles.SUPER_ADMIN, Roles.ADMIN]

  @OneToMany(() => OrderEntity, (order) => order.admin)
  public orders!: OrderEntity[]
}
