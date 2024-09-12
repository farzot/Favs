import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SendSMSDto } from "../dto/send-sms.dto";
import axios from "axios";
import { IResponse } from "src/common/type";
import { config } from "../../../config";
import { SMSTokenEntity } from "../../../core/entity/sms-token.entity";
import { SMSTokenRepository } from "../../../core/repository";

@Injectable()
export class SmsService {
	constructor(
		@InjectRepository(SMSTokenEntity)
		private readonly smsRepo: SMSTokenRepository,
	) {}

	public async sendSMS(dto: SendSMSDto): Promise<IResponse<[]>> {
		let sms_token: any = await this.smsRepo.find();
		sms_token = sms_token[0];
		// console.log(sms_token);
		try {
			if (!sms_token) {
				const response = await axios.post(`${config.ESKIZ_URL}/auth/login`, {
					email: config.ESKIZ_EMAIL,
					password: config.ESKIZ_PASSWORD,
				});
				const newToken = response.data.data.token;
				sms_token = await this.smsRepo.save({ token: newToken });
			}

			const data = await axios({
				method: "post",
				url: "https://notify.eskiz.uz/api/message/sms/send",
				headers: {
					Authorization: `Bearer ${(await sms_token).token}`,
				},
				data: {
					mobile_phone: dto.phone_number,
					message: dto.message,
					from: 4546,
				},
			});

			return { status_code: 200, data: [], message: "success" };
		} catch (err) {
			try {
				const new_token = await axios({
					method: "patch",
					url: "https://notify.eskiz.uz/api/auth/refresh",
					headers: {
						Authorization: `Bearer ${(await sms_token).token}`,
					},
				});

				await this.smsRepo.clear();
				await this.smsRepo.save({ token: new_token.data?.data?.token });
				const data = await axios({
					method: "post",
					url: "https://notify.eskiz.uz/api/message/sms/send",
					headers: {
						Authorization: `Bearer ${await new_token.data?.data?.token}`,
					},
					data: {
						mobile_phone: dto.phone_number,
						message: dto.message,
						from: 4546,
					},
				});

				return { status_code: 200, data: [], message: "success" };
			} catch (err) {
				throw err;
			}
		}
	}
}
