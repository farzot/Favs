import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCodeEntity } from '../../core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCodeEntity])],
  exports: [PromocodeService],
  controllers: [PromocodeController],
  providers: [PromocodeService],
})
export class PromocodeModule {}
