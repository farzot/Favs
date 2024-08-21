import { forwardRef, Module } from '@nestjs/common';
import { UserCreditCardService } from './user_credit_card.service';
import { UserCreditCardController } from './user_credit_card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCreditCardEntity } from '../../core/entity/user-credit-card.entity';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([UserCreditCardEntity]), forwardRef(() => UserModule)],
	controllers: [UserCreditCardController],
	providers: [UserCreditCardService],
	exports: [UserCreditCardService],
})
export class UserCreditCardModule {}
