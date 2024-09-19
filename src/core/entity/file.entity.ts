import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExecuterEntity } from "./executer.entity";

@Entity("files")
export class FileEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ name: "file_name", type: "varchar" })
	file_name!: string;

	@Column({ name: "path", type: "varchar" })
	path!: string;

	@Column({ name: "size", type: "int" })
	size!: number;

	@Column({ name: "mime_type", type: "varchar" })
	mime_type!: string;

	@Column({ type: "boolean", default: false })
	public is_primary!: boolean;

	// @OneToMany(() => ExecuterEntity, (executer) => executer.image, { onDelete: "CASCADE" })
	// executers!: ExecuterEntity[];

	// @OneToMany(() => ProfilePictureEntity, (profilePicture) => profilePicture.file)
	// public profile_pictures!: ProfilePictureEntity[];

	@Column({
		name: "is_active",
		type: "boolean",
		default: true,
	})
	is_active!: boolean;

	@Column({
		name: "is_deleted",
		type: "boolean",
		default: false,
	})
	is_deleted!: boolean;

	@Column({
		name: "created_at",
		type: "bigint",
		default: () => "EXTRACT(epoch FROM NOW()) * 1000",
	})
	created_at!: number;

	@Column({
		name: "updated_at",
		type: "bigint",
		default: Date.now(),
	})
	updated_at!: number;

	@Column({ name: "deleted_at", type: "bigint", nullable: true })
	deleted_at!: number;
}
