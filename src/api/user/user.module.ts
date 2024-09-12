import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  ExecuterEntity } from 'src/core/entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtToken } from 'src/infrastructure/lib/jwt-token';

@Module({
  imports: [TypeOrmModule.forFeature([ExecuterEntity]), JwtModule],
  controllers: [UserController],
  providers: [UserService, JwtToken],
  exports: [UserService]
})
export class UserModule {}
