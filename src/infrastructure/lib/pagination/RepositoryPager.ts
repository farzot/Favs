import { FindManyOptions, FindOptionsOrder, ObjectLiteral, Repository } from "typeorm";

import { Pager } from "./Pager";
import { IFindOptions, IResponsePagination } from "src/infrastructure/lib/baseService/interface";

// export class RepositoryPager {
// 	public static readonly DEFAULT_PAGE = 1;
// 	public static readonly DEFAULT_PAGE_SIZE = 10;

// 	public static async findAll<T extends ObjectLiteral>(
// 		repository: Repository<T>,
// 		message: string,
// 		options?: IFindOptions<T>,
// 	): Promise<IResponsePagination<T>> {
// 		const [data, count] = await repository.findAndCount(
// 			RepositoryPager.normalizePagination(options),
// 		);

// 		return Pager.of(
// 			data,
// 			count,
// 			options?.take ?? this.DEFAULT_PAGE_SIZE,
// 			options?.skip ?? this.DEFAULT_PAGE,
// 			200,
// 			message,
// 		);
// 	}

// 	private static normalizePagination<T>(options?: IFindOptions<T>): FindManyOptions<T> {
// 		let page = (options?.skip ?? RepositoryPager.DEFAULT_PAGE) - 1; // pagination is 1 indexed, convert into 0 indexed
// 		return {
// 			...options,
// 			take: options?.take,
// 			skip: page * (options?.take ?? RepositoryPager.DEFAULT_PAGE_SIZE),
// 		};
// 	}
// }

export class RepositoryPager {
	public static readonly DEFAULT_PAGE = 1;
	public static readonly DEFAULT_PAGE_SIZE = 10;

	public static async findAll<T extends ObjectLiteral>(
		repository: Repository<T>,
		message: string,
		options?: IFindOptions<T>,
	): Promise<IResponsePagination<T>> {
		// Sahifalash va tartiblash opsiyalarini olamiz
		const normalizedOptions = RepositoryPager.normalizePagination(options);

		// Tartibni qo'shamiz, so'nggi yaratilganlarni birinchi sahifalarda ko'rsatish uchun
		normalizedOptions.order = {
			created_at: "DESC", // created_at maydoni bo'yicha so'nggi yozuvlar birinchi bo'lib ko'rsatiladi
		} as unknown as FindOptionsOrder<T>;

		const [data, count] = await repository.findAndCount(normalizedOptions);
		return Pager.of(
			data,
			count,
			normalizedOptions.take ?? this.DEFAULT_PAGE_SIZE,
			normalizedOptions.skip ?? this.DEFAULT_PAGE,
			200,
			message,
		);
	}

	private static normalizePagination<T>(options?: IFindOptions<T>): FindManyOptions<T> {
		let page = (options?.skip ?? RepositoryPager.DEFAULT_PAGE) - 1; // pagination 1-indexed, 0-indexed ga aylantiramiz
		return {
			...options,
			take: options?.take ?? this.DEFAULT_PAGE_SIZE, // sahifalash uchun oladigan yozuvlar soni
			skip: page * (options?.take ?? this.DEFAULT_PAGE_SIZE), // sahifalash uchun o'tkaziladigan yozuvlar soni
		};
	}
}
