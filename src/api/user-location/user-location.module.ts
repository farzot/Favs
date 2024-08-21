import { Module } from '@nestjs/common';
import { UserLocationService } from './user-location.service';
import { UserLocationController } from './user-location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLocationEntity } from 'src/core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLocationEntity])],
  controllers: [UserLocationController],
  providers: [UserLocationService],
})
export class UserLocationModule {}
