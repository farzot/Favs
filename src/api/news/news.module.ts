import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '../../core/entity/news.entity';
import { FileService } from '../file/file.service';
import { FileEntity } from '../../core/entity';

@Module({
    imports: [TypeOrmModule.forFeature([NewsEntity, FileEntity])],
    controllers: [NewsController],
    providers: [NewsService, FileService],
})
export class NewsModule {}
