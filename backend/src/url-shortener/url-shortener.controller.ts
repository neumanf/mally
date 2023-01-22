import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Query,
    Res,
    Req,
    UseGuards,
    Delete,
    Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Url } from '@prisma/client';

import { CreateShortUrlDto } from './DTOs/create-short-url.dto';
import { UrlShortenerService } from './url-shortener.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtResponse } from '../auth/strategies/jwt.strategy';

@Controller('url-shortener')
export class UrlShortenerController {
    constructor(private readonly urlShortnerService: UrlShortenerService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createShortUrl(@Req() request: Request, @Body() createShortUrlDto: CreateShortUrlDto) {
        const user = request.user as JwtResponse;
        const url = await this.urlShortnerService.createShortUrl(createShortUrlDto.url, user.id);

        return { short_url: url };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findShortUrls(@Req() request: Request): Promise<Url[]> {
        const user = request.user as JwtResponse;
        return this.urlShortnerService.findShortUrlsByUserId(user.id);
    }

    @Get('/redirect')
    async redirectUrl(@Res() response: Response, @Query('url') shortUrl: string) {
        const url = await this.urlShortnerService.findLongUrl(shortUrl);

        if (!url) throw new NotFoundException('URL not found.');

        return response.status(303).redirect(url);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteShortUrl(@Param('id') id: string) {
        return this.urlShortnerService.deleteShortUrl(+id);
    }
}
