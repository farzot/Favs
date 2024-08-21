import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { join } from "path";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import * as fs from "fs";
import { FileEntity } from "../../core/entity";
import { FileRepository } from "../../core/repository/file.repository";

@Injectable()
export class FileService extends BaseService<CreateFileDto, UpdateFileDto, FileEntity> {
	constructor(
		@InjectRepository(FileEntity)
		repository: FileRepository,
	) {
		super(repository, "File");
	}
	async deleteFile(id: string, lang: string = "en") {
		const { data: founFile } = await this.findOneById(id, lang);
		const filePath = join(__dirname, "../../../../uploads", founFile.path);
		// Check if the file exists
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		return await this.delete(id, lang);
	}
}
