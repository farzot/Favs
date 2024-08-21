import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinTable, ManyToMany, } from "typeorm";
import { FileEntity } from "./file.entity";

@Entity("news")
export class NewsEntity extends BaseEntity {
    @Column({ type: "varchar", nullable: true })
    public title_uz!: string;

    @Column({ type: "varchar", nullable: true })
    public title_en!: string;

    @Column({ type: "varchar", nullable: true })
    public title_ru!: string;

    @Column({ type: "varchar", nullable: true })
    public description_uz!: string;

    @Column({ type: "varchar", nullable: true })
    public description_en!: string;

    @Column({ type: "varchar", nullable: true })
    public description_ru!: string;

    @ManyToMany(() => FileEntity)
    @JoinTable({
        name: 'news_files',
        joinColumn: {
            name: 'news',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'files',
            referencedColumnName: 'id',
        },
    })
    public files!: FileEntity[];
}

