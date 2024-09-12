import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("sms_token")
export class SMSTokenEntity {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@Column({ type: "varchar" })
	public token!: string;
}
