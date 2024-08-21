import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CurrentLanguage } from '../../common/decorator/current-language';
import { RolesDecorator } from '../auth/roles/RolesDecorator';
import { JwtAuthGuard } from '../auth/user/AuthGuard';
import { Roles } from '../../common/database/Enums';
import { RolesGuard } from '../auth/roles/RoleGuard';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }
    
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
    @Post()
    create(
        @CurrentLanguage() lang: string,
        @Body() createNewsDto: CreateNewsDto
    ) {
        return this.newsService.createNews(createNewsDto, lang);
    }

    @Get()
    findAll(
        @CurrentLanguage() lang: string,
    ) {
        return this.newsService.findAllNews(lang);
    }

    @Get(':id')
    findOne(@Param('id') id: string,
        @CurrentLanguage() lang: string,
    ) {
        return this.newsService.findOneNewsById(id, lang);
    }

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateNewsDto: UpdateNewsDto,
        @CurrentLanguage() lang: string,
    ) {
        return this.newsService.updateNews(id, updateNewsDto, lang);
    }

	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentLanguage() lang: string,) {
        return this.newsService.remove(id, lang);
    }
}
