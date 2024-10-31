import { Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { BaseService } from "../../infrastructure/lib/baseService";
import { BusinessEntity, ExecuterEntity, ReservationEntity } from "../../core/entity";
import { ReservationRepository } from "../../core/repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, DataSource, FindOptionsWhere, MoreThan, Repository } from "typeorm";
import { BusinessNotFound } from "../business/exception/not-found";
import { ReservationStatus, Roles } from "../../common/database/Enums";
import { responseByLang } from "../../infrastructure/lib/prompts/successResponsePrompt";
import axios from "axios";
import { TelegramChatIDEntity } from "../../core/entity/tg-chat-id-business.entity";
import { TelegramTopicIDEntity } from "../../core/entity/tg-topic-id-business.entity";
import { TelegramChatIDNotFound } from "./exception/chat_id-not-found.exception";
import { TelegramTopicIDNotFound } from "./exception/topic_id-not-found.exception";
import { config } from "../../config";
import { AuthorizationError, NotSentMessage } from "../auth/exception";
import { ReservationNotFound } from "./exception/reservation-not-found.exception";
import { CreateNotificationDto } from "../notifications/dto/create-notification.dto";
import { NotificationsService } from "../notifications/notifications.service";
import { CancelReservationDto } from "./dto/cancel-reservation.dto";
import { CancelConfirmedReservationDto } from "./dto/cancel-confirmed-reservation.dto";
import {
	CancellationNotAllowed,
	RuhsatEtilmaganHarakat,
} from "./exception/cancellation-not-allowed.exception";
import { SearchReservationByAdminDto, SearchReservationDto } from "./dto/sear-reservation.dto";
import { IFindOptions, IResponsePagination } from "../../infrastructure/lib/baseService/interface";
import { Cron } from "@nestjs/schedule";
import { MailService } from "../mail/mail.service";

@Injectable()
export class ReservationsService extends BaseService<
	CreateReservationDto,
	UpdateReservationDto,
	ReservationEntity
> {
	constructor(
		@InjectRepository(ReservationEntity) repository: ReservationRepository,
		// @InjectRepository(TelegramChatIDEntity)
		// private readonly chatIdRepo: TelegramChatIDRepository,
		// @InjectRepository(TelegramTopicIDEntity)
		// private readonly topicIdRepo: TelegramTopicIDRepository,
		private dataSource: DataSource,
		private readonly notificationService: NotificationsService,
		private readonly mailService: MailService,
	) {
		super(repository, "Reservation");
	}

	// Reservation request create qilish client tomonidan
	public async createReservationByClient(
		dto: CreateReservationDto,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Businessni topish
				const check_business = await query.manager.findOne(BusinessEntity, {
					where: { id: dto.business_id, is_deleted: false },
				});

				if (!check_business) {
					throw new BusinessNotFound();
				}

				// Biznes rezervatsiyalari bloklanganligini tekshirish
				if (check_business.is_reservation_blocked) {
					throw new RuhsatEtilmaganHarakat();
				}

				// Yangi rezervatsiya yaratish
				const reservation = new ReservationEntity();
				reservation.business = check_business;
				reservation.guest_name = dto.guest_name;
				reservation.guest_email = executer.email;
				reservation.guest_phone = dto.guest_phone;
				reservation.number_of_guests = dto.number_of_guests;
				reservation.reservation_time = dto.reservation_time;
				reservation.details = dto.details;
				reservation.deposit_amount = check_business.reservation_deposit_amount;
				reservation.status = ReservationStatus.PENDING; // Default holatda PENDING
				reservation.created_at = Date.now();
				reservation.user = executer;
				reservation.created_by = executer;

				// Rezervatsiyani saqlash
				const savedReservation = await query.manager.save(ReservationEntity, reservation);
				console.log("Najim 1");
				// Tranzaktsiyani yakunlash
				await query.commitTransaction();

				// Telegram xabarini jo'natish
				const chat_id = await query.manager.findOne(TelegramChatIDEntity, {
					where: { business: check_business, is_deleted: false },
				});

				if (!chat_id) {
					throw new TelegramChatIDNotFound();
				}

				console.log("Najim 1,5");

				const topic_id = await query.manager.findOne(TelegramTopicIDEntity, {
					where: { chat_id: chat_id, is_deleted: false },
				});

				if (!topic_id) {
					throw new TelegramTopicIDNotFound();
				}

				console.log("Najim 2");
				console.log("caht_id: ", chat_id);
				console.log("topic_id : ", topic_id);

				// Telegramga yuboriladigan xabar matnini shakllantirish
				const telegram_message = `
🔔 Yangi Rezervatsiya!
--------------------------
🏢 Biznes: ${check_business.name}
👤 Mijoz: ${dto.guest_name}
📞 Telefon: ${dto.guest_phone}
📧 Email: ${executer.email}
👥 Mehmonlar soni: ${dto.number_of_guests}
🕒 Vaqt: ${new Date(dto.reservation_time).toLocaleString("uz-Latn-UZ", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})}
💵 Depozit: ${reservation.deposit_amount}
📌 Holati: ${reservation.status === ReservationStatus.PENDING ? "Kutilmoqda" : "Muvaffaqiyatli"}


🔔 Новый Резерв!
--------------------------
🏢 Бизнес: ${check_business.name}
👤 Клиент: ${dto.guest_name}
📞 Телефон: ${dto.guest_phone}
📧 Email: ${executer.email}
👥 Количество гостей: ${dto.number_of_guests}
🕒 Время: ${new Date(dto.reservation_time).toLocaleString("uz-Latn-UZ", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})}
💵 Депозит: ${reservation.deposit_amount}
📌 Статус: ${reservation.status === ReservationStatus.PENDING ? "Ожидание" : "Успешно"}
`;

				console.log("Najim 3");
				// 				const telegram_message = `
				// <b>Yangi Rezervatsiya</b>
				// Biznes: ${check_business.name}
				// Mijoz: ${dto.guest_name}
				// Telefon: ${dto.guest_phone}
				// Email: ${executer.email}
				// Mehmonlar soni: ${dto.number_of_guests}
				// Vaqt: ${new Date(dto.reservation_time).toLocaleString("uz-Latn-UZ", {
				// 					year: "numeric",
				// 					month: "2-digit",
				// 					day: "2-digit",
				// 					hour: "2-digit",
				// 					minute: "2-digit",
				// 					second: "2-digit",
				// 				})}
				// Depozit: ${reservation.deposit_amount}
				// Holati: ${reservation.status === ReservationStatus.PENDING ? "Kutilmoqda" : "Muvaffaqiyatli"}`;

				// Telegramga xabar yuborish
				await sendMessageToTelegram(
					config.BOT_TOKEN,
					chat_id.chat_id,
					topic_id.topic_id,
					telegram_message,
				);
				console.log("config.BOT_TOKEN", config.BOT_TOKEN);
				console.log("chat_id.chat_id", chat_id.chat_id);
				console.log("topic_id.topic_id", topic_id.topic_id);
				console.log("Najim 4");
				resolve({
					status_code: 201,
					data: savedReservation,
					message: responseByLang("create", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// client tomonidan reservation create qilish uchun yuborilgan so'rovni Business admin panelidan confirm qilish
	public async confirmReservationByAdmin(
		reservation_id: string,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();
				const check_business = executer?.business[0];
				if (!check_business) throw new BusinessNotFound();

				// Reservatsiyani topish
				const reservation = await query.manager.findOne(ReservationEntity, {
					where: {
						id: reservation_id,
						status: ReservationStatus.PENDING,
						business: check_business,
						is_deleted: false,
					},
					relations: ["business", "user"],
				});

				if (!reservation) {
					throw new ReservationNotFound();
				}

				// Rezervatsiyani tasdiqlash
				reservation.status = ReservationStatus.CONFIRMED;
				reservation.updated_at = Date.now();
				reservation.updated_by = executer;
				await query.manager.save(ReservationEntity, reservation);

				// Rus va O'zbek tilidagi xabarlarni tayyorlash
				const uzNotificationDto = new CreateNotificationDto();
				uzNotificationDto.title = "Joy band qilish tasdiqlandi!";
				uzNotificationDto.message = `
				Assalomu aleykum, hurmatli ${reservation.guest_name}!
				Sizning joy band qilish uchun bergan so'rovingiz tasdiqlandi:
				- Biznes: ${reservation.business.name}
				- Kun: ${new Date(reservation.reservation_time).toLocaleString("uz-Latn-UZ")}
				- Mehmonlar soni: ${reservation.number_of_guests}
				- Tafsilotlar: ${reservation.details}
			`;
				uzNotificationDto.user = reservation.user.id;

				const ruNotificationDto = new CreateNotificationDto();
				ruNotificationDto.title = "Подтверждение бронирования!";
				ruNotificationDto.message = `
				Здравствуйте, уважаемый ${reservation.guest_name}!
				Ваш запрос на бронирование был подтверждён:
				- Бизнес: ${reservation.business.name}
				- Дата: ${new Date(reservation.reservation_time).toLocaleString("ru-RU")}
				- Количество гостей: ${reservation.number_of_guests}
				- Детали: ${reservation.details}
			`;
				ruNotificationDto.user = reservation.user.id;

				// Xabarlarni parallel ravishda jo'natish
				await Promise.all([
					this.notificationService.createNotificationForOneUser(ruNotificationDto, lang),
					this.notificationService.createNotificationForOneUser(uzNotificationDto, lang),
					await this.mailService.sendReservationMessage(reservation.user, {
						title: "Joy band qilish tasdiqlandi! / Подтверждение бронирования!",
						message: `
            <p>Assalomu aleykum, hurmatli ${reservation.guest_name}!</p>
            <p>Сизнинг joy band qilish uchun bergan so'rovingiz tasdiqlandi:</p>
            <ul>
                <li>Biznes: ${reservation.business.name}</li>
                <li>Kun: ${new Date(reservation.reservation_time).toLocaleString("uz-Latn-UZ")}</li>
                <li>Mehmonlar soni: ${reservation.number_of_guests}</li>
                <li>Tafsilotlar: ${reservation.details}</li>
            </ul>
            <br />
            <p>Здравствуйте, уважаемый ${reservation.guest_name}!</p>
            <p>Ваш запрос на бронирование был подтвержден:</p>
            <ul>
                <li>Бизнес: ${reservation.business.name}</li>
                <li>Дата: ${new Date(reservation.reservation_time).toLocaleString("ru-RU")}</li>
                <li>Количество гостей: ${reservation.number_of_guests}</li>
                <li>Детали: ${reservation.details}</li>
            </ul>
        `,
					}),
				]);

				await query.commitTransaction();
				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("success", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// client tomonidan reservation create qilish uchun yuborilgan so'rovni Business admin panelidan reject qilish
	public async rejectReservationByAdmin(
		cancelReservationDto: CancelReservationDto,
		executer: ExecuterEntity,
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Reservatsiyani topish
				const reservation = await query.manager.findOne(ReservationEntity, {
					where: {
						id: cancelReservationDto.reservation_id,
						status: ReservationStatus.PENDING,
					},
					relations: ["business"],
				});

				if (!reservation) {
					throw new ReservationNotFound();
				}

				// Adminning rad etish huquqini tekshirish
				const businessAdmin = await query.manager.findOne(ExecuterEntity, {
					where: { id: executer.id, role: Roles.ADMIN, business: reservation.business },
				});

				if (!businessAdmin) {
					throw new AuthorizationError();
				}

				// Rezervatsiyani rad etish
				reservation.status = ReservationStatus.CANCELLED;
				if (cancelReservationDto.cancellation_reason)
					reservation.cancellation_reason = cancelReservationDto.cancellation_reason;
				reservation.updated_at = Date.now();
				reservation.updated_by = executer;

				if (cancelReservationDto.cancellation_time) {
					reservation.cancellation_time =
						cancelReservationDto.cancellation_time.getTime();
				}

				await query.manager.save(ReservationEntity, reservation);

				await query.commitTransaction();

				// Xabar yuborish uchun DTO tayyorlash
				const uzNotificationDto = new CreateNotificationDto();
				uzNotificationDto.title = "Joy band qilish rad etildi!";
				uzNotificationDto.message = `
				Hurmatli ${reservation.created_by.first_name},
				Sizning joy band qilish uchun bergan so'rovingiz rad etildi:
				- Biznes: ${reservation.business.name}
				- Sababi: ${cancelReservationDto.cancellation_reason || "Nomaʼlum"}
			`;
				uzNotificationDto.user = reservation.created_by.id;

				const ruNotificationDto = new CreateNotificationDto();
				ruNotificationDto.title = "Бронирование отклонено!";
				ruNotificationDto.message = `
				Уважаемый ${reservation.created_by.first_name},
				Ваш запрос на бронирование был отклонён:
				- Бизнес: ${reservation.business.name}
				- Причина: ${cancelReservationDto.cancellation_reason || "Неизвестно"}
			`;
				ruNotificationDto.user = reservation.created_by.id;

				// Xabarlarni jo'natish
				await Promise.all([
					this.notificationService.createNotificationForOneUser(ruNotificationDto, lang),
					this.notificationService.createNotificationForOneUser(uzNotificationDto, lang),
					await this.mailService.sendReservationMessage(executer, {
						title: "Joy band qilish rad etildi! / Бронирование отклонено!",
						message: `
						<p>Hurmatli ${reservation.created_by.first_name},</p>
						<p>Sizning joy band qilish so'rovingiz rad etildi:</p>
						<ul>
							<li>Biznes: ${reservation.business.name}</li>
							<li>Sababi: ${cancelReservationDto.cancellation_reason || "Nomaʼlum"}</li>
						</ul>
						<br />
						<p>Уважаемый ${reservation.created_by.first_name},</p>
						<p>Ваш запрос на бронирование был отклонён:</p>
						<ul>
							<li>Бизнес: ${reservation.business.name}</li>
							<li>Причина: ${cancelReservationDto.cancellation_reason || "Неизвестно"}</li>
						</ul>
					`,
					}),
				]);

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("success", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// reservation ni user tomonidan bekor qilish
	public async cancelConfirmedReservationByClient(
		cancelReservationDto: CancelConfirmedReservationDto,
		user: ExecuterEntity, // Foydalanuvchi entitysi
		lang: string,
	) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Reservatsiyani topish
				const reservation = await query.manager.findOne(ReservationEntity, {
					where: {
						id: cancelReservationDto.reservation_id,
						status: ReservationStatus.CONFIRMED,
					},
					relations: ["business", "created_by"],
				});

				if (!reservation) {
					throw new ReservationNotFound();
				}

				if (reservation.user !== user) {
					throw new AuthorizationError();
				}

				// Bekor qilish vaqtini tekshirish
				const currentTime = Date.now();
				const cancellationTime = reservation.created_at;
				const differenceInHours = (currentTime - cancellationTime) / (1000 * 60 * 60);

				let refundPercentage = 0;

				if (differenceInHours < 1) {
					throw new CancellationNotAllowed();
				} else if (differenceInHours < 3) {
					refundPercentage = 25;
				} else if (differenceInHours < 6) {
					refundPercentage = 50;
				} else if (differenceInHours < 12) {
					refundPercentage = 75;
				} else {
					refundPercentage = 100;
				}

				// Rezervatsiyani bekor qilish
				reservation.status = ReservationStatus.CANCELLED;
				reservation.cancellation_reason =
					cancelReservationDto.cancellation_reason || "Nomaʼlum";
				reservation.updated_at = Date.now();
				reservation.updated_by = user;

				await query.manager.save(ReservationEntity, reservation);

				// Depozitni qaytarish
				const refundAmount = (reservation.deposit_amount * refundPercentage) / 100;

				await query.commitTransaction();

				// Telegram xabarini jo'natish
				const chat_id = await query.manager.findOne(TelegramChatIDEntity, {
					where: { business: reservation.business, is_deleted: false },
				});

				if (!chat_id) {
					throw new TelegramChatIDNotFound();
				}

				const topic_id = await query.manager.findOne(TelegramTopicIDEntity, {
					where: { chat_id: chat_id, is_deleted: false },
				});

				if (!topic_id) {
					throw new TelegramTopicIDNotFound();
				}

				// Telegram xabari matnini shakllantirish
				const telegram_message = `
<b>Rezervatsiya Bekor Qilindi!</b>
<hr>
<b>Biznes:</b> ${reservation.business.name}
<b>Mijoz:</b> ${reservation.created_by.first_name} ${reservation.created_by.last_name}
<b>Telefon:</b> ${reservation.user.phone_number}
<b>Email:</b> ${reservation.user.email}
<b>Bekor qilish sababi:</b> ${cancelReservationDto.cancellation_reason || "Nomaʼlum"}
<hr>
<b>Резерв Отменён!</b>
<hr>
<b>Бизнес:</b> ${reservation.business.name}
<b>Клиент:</b> ${reservation.created_by.first_name} ${reservation.created_by.last_name}
<b>Телефон:</b> ${reservation.user.phone_number}
<b>Email:</b> ${reservation.user.email}
<b>Причина отмены:</b> ${cancelReservationDto.cancellation_reason || "Неизвестно"}
<hr>
`;
				// Telegram xabarini jo'natish
				await sendMessageToTelegram(
					config.BOT_TOKEN,
					chat_id.chat_id,
					topic_id.topic_id,
					telegram_message,
				);

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("success", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// cron orqali reservation haqida userga auto eslatma jo'natish
	@Cron("* * * * *") // Har minutda tekshirish
	async handleCron(lang: string) {
		const now = Date.now();
		console.log("now ---> ",now)
		const reservations = await this.getRepository.find({
			where: {
				status: ReservationStatus.CONFIRMED,
				reservation_time: MoreThan(now), // Hozirgi vaqtdan keyin bo'lishi kerak
			},
		});
		console.log("reservations--> ",reservations)
		if (reservations.length === 0) {
			// Rezervatsiyalar topilmadi, hech narsa qilmaslik kerak
			return;
		}
		console.log("Najim")

		const oneHour = 1 * 60 * 60 * 1000;
		for (const reservation of reservations) {
			console.log("Najim for ichida")
			console.log(now)
			const timeBeforeReservation = reservation.reservation_time - now;
			console.log(timeBeforeReservation)
			console.log(timeBeforeReservation.toLocaleString())
			console.log(now + 1 * 60 * 60 * 1000 + 60 * 1000);
			if (timeBeforeReservation <= oneHour && timeBeforeReservation > oneHour - 59 * 1000) {
				// 1 soatdan kam vaqt qolgan
				console.log("Najim if ichida");
				const uzNotificationDto = new CreateNotificationDto();
				uzNotificationDto.title = "Eslatma: Joy band qilish!";
				uzNotificationDto.message = `
                Assalomu aleykum, hurmatli ${reservation.created_by.first_name}!
                Sizning joy band qilishingiz ${new Date(
					reservation.reservation_time,
				).toLocaleString("uz-Latn-UZ")} vaqtida bo'lib o'tadi.
                - Biznes: ${reservation.business.name}
                - Mehmonlar soni: ${reservation.number_of_guests}
                - Tafsilotlar: ${reservation.details}
            `;
				uzNotificationDto.user = reservation.created_by.id;

				const ruNotificationDto = new CreateNotificationDto();
				ruNotificationDto.title = "Напоминание: Бронирование места!";
				ruNotificationDto.message = `
                Здравствуйте, уважаемый ${reservation.created_by.first_name}!
                Ваше бронирование состоится ${new Date(reservation.reservation_time).toLocaleString(
					"ru-RU",
				)}.
                - Бизнес: ${reservation.business.name}
                - Количество гостей: ${reservation.number_of_guests}
                - Детали: ${reservation.details}
            `;
				ruNotificationDto.user = reservation.created_by.id;
				console.log("Promise all dan avval: ");
				// Xabarlarni parallel jo'natish
				await Promise.all([
					this.notificationService.createNotificationForOneUser(uzNotificationDto, "uz"), // 'uz' tili
					this.notificationService.createNotificationForOneUser(ruNotificationDto, "ru"), // 'ru' tili
					this.mailService.sendReservationMessage(reservation.created_by, {
						title: "Joy band qilish eslatmasi! / Напоминание о бронировании!",
						message: `
                        <p>Assalomu aleykum, hurmatli ${reservation.created_by.first_name}!</p>
                        <p>Sizning joy band qilishingiz tasdiqlandi:</p>
                        <ul>
                            <li>Biznes: ${reservation.business.name}</li>
                            <li>Vaqt: ${new Date(reservation.reservation_time).toLocaleString(
								"uz-Latn-UZ",
							)}</li>
                            <li>Mehmonlar soni: ${reservation.number_of_guests}</li>
                            <li>Tafsilotlar: ${reservation.details}</li>
                        </ul>
                        <br />
                        <p>Здравствуйте, уважаемый ${reservation.created_by.first_name}!</p>
                        <p>Ваше бронирование состоится:</p>
                        <ul>
                            <li>Бизнес: ${reservation.business.name}</li>
                            <li>Время: ${new Date(reservation.reservation_time).toLocaleString(
								"ru-RU",
							)}</li>
                            <li>Количество гостей: ${reservation.number_of_guests}</li>
                            <li>Детали: ${reservation.details}</li>
                        </ul>
                    `,
					}),
				]);
			}
			console.log("Najim if dan tashqarida")
		}
	}

	// business adminlari tomonidan business ga tegishli barcha reservationlarni olish
	public async getAllReservationsByBusinessAdmin(
		queryParams: SearchReservationDto,
		executer: ExecuterEntity,
		lang: string,
		options?: IFindOptions<ReservationEntity>, // Sahifalash imkoniyati
	): Promise<IResponsePagination<ReservationEntity>> {
		const business_id = executer.business[0]?.id;
		// Qidirish shartlari
		const where: FindOptionsWhere<ReservationEntity> = {
			business: { id: business_id },
			is_deleted: false,
			...(queryParams.status && { status: queryParams.status }),
			...(queryParams.date && {
				reservation_time: Between(
					new Date(queryParams.date.start).getTime(),
					new Date(queryParams.date.end).getTime(),
				),
			}),
		};

		// Options ga shartlarni qo'shish
		const findOptions: IFindOptions<ReservationEntity> = {
			where,
			...options,
		};

		// Rezervasyonlarni olish
		return await this.findAllWithPagination(lang, findOptions); // findAllWithPagination ni chaqirish
	}

	// user tomonidan userga tegishli reservationlarni barchasini olish
	public async getAllSelfReservations(
		queryParams: SearchReservationDto,
		executer: ExecuterEntity,
		lang: string,
		options?: IFindOptions<ReservationEntity>, // Sahifalash imkoniyati
	): Promise<IResponsePagination<ReservationEntity>> {
		// Qidirish shartlari
		const where: FindOptionsWhere<ReservationEntity> = {
			created_by: executer, // User o'z rezervatsiyalarini olish uchun
			is_deleted: false,
			...(queryParams.status && { status: queryParams.status }), // Agar status berilgan bo'lsa, shartlarga qo'shish
			...(queryParams.date && {
				reservation_time: Between(
					new Date(queryParams.date.start).getTime(),
					new Date(queryParams.date.end).getTime(),
				),
			}),
		};

		// Options ga shartlarni qo'shish
		const findOptions: IFindOptions<ReservationEntity> = {
			where,
			...options,
		};

		// Rezervatsiyalarni olish
		return await this.findAllWithPagination(lang, findOptions); // findAllWithPagination ni chaqirish
	}

	// websayt admin paneli orqali barcha reservationlarni olish filter bilan
	public async getAllReservationsForAdmin(
		queryParams: SearchReservationByAdminDto, // Admin tomonidan qidirish parametrlarini qabul qiladi
		lang: string,
		options?: IFindOptions<ReservationEntity>, // Sahifalash imkoniyati
	): Promise<IResponsePagination<ReservationEntity>> {
		const { business_id, username, status, date } = queryParams;

		// Qidirish shartlari (where)
		const where: FindOptionsWhere<ReservationEntity> = {
			is_deleted: false,
			...(business_id && { business: { id: business_id } }), // Agar business_id kiritilgan bo'lsa
			...(username && { created_by: { username: username } }), // Agar username kiritilgan bo'lsa
			...(status && { status }), // Agar status kiritilgan bo'lsa
			...(date && {
				reservation_time: Between(
					new Date(date.start).getTime(),
					new Date(date.end).getTime(),
				),
			}), // Agar sana kiritilgan bo'lsa
		};

		// Options ga shartlarni qo'shish
		const findOptions: IFindOptions<ReservationEntity> = {
			where,
			...options,
		};

		// Rezervatsiyalarni olish
		return await this.findAllWithPagination(lang, findOptions); // findAllWithPagination ni chaqirish
	}

	// business Adminlari reservation mavjudligini vaqtinchalik blocklash
	public async blockReservation(executer: ExecuterEntity, lang: string) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Biznesni topish
				const business = await query.manager.findOne(BusinessEntity, {
					where: { id: executer.business?.[0].id, is_deleted: false },
				});

				if (!business) {
					throw new BusinessNotFound();
				}

				// Faqat BUSINESS_OWNER va BUSINESS_MANAGER bloklash huquqiga ega
				if (
					executer.role !== Roles.BUSINESS_OWNER &&
					executer.role !== Roles.BUSINESS_MANAGER
				) {
					throw new AuthorizationError();
				}

				// Rezervatsiya bloklash holatini o'zgartirish
				business.is_reservation_blocked = true;
				business.updated_by = executer;

				await query.manager.save(BusinessEntity, business);

				await query.commitTransaction();

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("update", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}

	// business Adminlari reservation mvjudligini qayta tiklashi
	public async unblockReservation(executer: ExecuterEntity, lang: string) {
		const query = this.dataSource.createQueryRunner();
		return new Promise(async (resolve, reject) => {
			try {
				await query.connect();
				await query.startTransaction();

				// Biznesni topish
				const business = await query.manager.findOne(BusinessEntity, {
					where: { id: executer.business?.[0].id, is_deleted: false },
				});

				if (!business) {
					throw new BusinessNotFound();
				}

				// Faqat BUSINESS_OWNER va BUSINESS_MANAGER blokdan chiqarish huquqiga ega
				if (
					executer.role !== Roles.BUSINESS_OWNER &&
					executer.role !== Roles.BUSINESS_MANAGER
				) {
					throw new AuthorizationError();
				}

				// Rezervatsiya blok holatini o'zgartirish
				business.is_reservation_blocked = false;
				business.updated_by = executer;

				await query.manager.save(BusinessEntity, business);

				await query.commitTransaction();

				resolve({
					status_code: 200,
					data: [],
					message: responseByLang("update", lang),
				});
			} catch (error) {
				await query.rollbackTransaction();
				reject(error);
			} finally {
				await query.release();
			}
		});
	}
}

export async function sendMessageToTelegram(
	token: string,
	chat_id: string,
	topic_id: any,
	text: string,
) {
	// const token = '7307165860:AAEQw23GN3cIcBtb1_go5IszYf09ZZ_ysIg'; // O'zingizning bot tokeningiz
	// const chatId = '-1002426099208'; // O'zingizning guruh yoki mavzu ID
	// const topicId = '2'; // Agar mavzuga yubormoqchi bo'lsangiz

	const url = `https://api.telegram.org/bot${token}/sendMessage`;
	const data = {
		chat_id: chat_id,
		text: text,
		// parse_mode: "HTML", // HTML formatni ishlatish uchun
		message_thread_id: topic_id, // Mavzuga yuborish uchun
	};
	console.log(data.chat_id);
	console.log(data.text);
	console.log(data.message_thread_id);

	try {
		await axios.post(url, data);
		console.log("Telegramga xabar yuborildi");
	} catch (error) {
		console.error("Telegramga xabar yuborishda xatolik:", error);
	}
}
