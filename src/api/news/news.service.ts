import { Injectable } from "@nestjs/common";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { BaseService } from "../../infrastructure/lib/baseService";
import { NewsEntity } from "../../core/entity/news.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsRepository } from "../../core/repository/news.repository";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import { FileService } from "../file/file.service";
import { deleteFile } from "../../infrastructure/lib/fileService";

@Injectable()
export class NewsService extends BaseService<CreateNewsDto, UpdateNewsDto, NewsEntity> {
	constructor(
		@InjectRepository(NewsEntity) private readonly newsRepo: NewsRepository,
		private readonly fileService: FileService,
	) {
		super(newsRepo, "news");
	}

	public async createNews(dto: CreateNewsDto, lang: string) {
		const news = new NewsEntity();
		news.title_uz = dto.title_uz;
		news.title_en = dto.title_en;
		news.title_ru = dto.title_ru;
		news.description_uz = dto.description_uz;
		news.description_en = dto.description_en;
		news.description_ru = dto.description_ru;

		news.files = [];
		for (const fileDto of dto.files) {
			const file = (await this.fileService.findOneById(fileDto.id, lang)).data;
			if (file) {
				news.files.push(file);
			}
		}

		await this.newsRepo.save(news);
		const message = responseByLang("create", lang);

		return {
			status_code: 201,
			message,
			data: [],
		};
	}

	public async findAllNews(lang: string) {
		const _news = await this.findAll(lang, {
			relations: { files: true },
			where: { is_deleted: false },
		});

		const news = this.filterNewsByLang(_news.data, lang);
		const message = responseByLang("get_all", lang);
		return { status_code: 200, data: news, message };
	}

	public async findOneNewsById(id: string, lang: string) {
		const _news = await this.findOneById(id, lang, {
			relations: { files: true },
			where: { is_deleted: false },
		});

		const news = this.filterNewsByLang([_news.data], lang)[0];

		const message = responseByLang("get_one", lang);
		return { status_code: 200, data: news, message };
	}

	public filterNewsByLang(dto: NewsEntity[], lang: string) {
		return dto.map((item) => {
			if (lang == "uz") {
				return {
					...item,
					title: item.title_uz,
					description: item.description_uz,
				};
			} else if (lang == "ru") {
				return {
					...item,
					title: item.title_ru,
					description: item.description_ru,
				};
			} else if (lang == "en") {
				return {
					...item,
					title: item.title_en,
					description: item.description_en,
				};
			} else {
				return {
					...item,
					title: item.title_en,
					description: item.description_en,
				};
			}
		});
	}

	async updateNews(id: string, dto: UpdateNewsDto, lang: string = "ru") {
		const { data: found_news } = await this.findOneById(id, lang, {
			relations: { files: true },
			where: { is_deleted: false },
		});

		if (dto.files) {
			const news_file_ids = dto.files.map((fileDto) => fileDto.id);

			for (const file of found_news.files) {
				if (!news_file_ids.includes(file.id)) {
					await deleteFile(file.path);
					await this.fileService.delete(file.id, lang);
				}
			}

			found_news.files = [];
			for (const fileId of news_file_ids) {
				const { data: file } = await this.fileService.findOneById(fileId, lang, {
					where: { is_deleted: false },
				});
				if (file) {
					found_news.files.push(file);
				}
			}
		}
		found_news.title_uz = dto.title_uz || found_news.title_uz;
		found_news.title_en = dto.title_en || found_news.title_en;
		found_news.title_ru = dto.title_ru || found_news.title_ru;
		found_news.description_uz = dto.description_uz || found_news.description_uz;
		found_news.description_en = dto.description_en || found_news.description_en;
		found_news.description_ru = dto.description_ru || found_news.description_ru;

		await this.newsRepo.save(found_news);

		const message = responseByLang("update", lang);
		return {
			status_code: 200,
			message,
			data: [],
		};
	}

	async remove(id: string, lang: string) {
		const { data: found_news } = await this.findOneById(id, lang, {
			relations: { files: true },
			where: { is_deleted: false },
		});

		if (found_news) {
			if (found_news.files) {
				found_news.files.map(async (file: any) => {
					await deleteFile(file.path);
					await this.fileService.delete(file.id, lang);
				});
			}
			await this.delete(id, lang);
		}
		const message = responseByLang("delete", lang);
		return { status_code: 200, message, data: [] };
	}
}
