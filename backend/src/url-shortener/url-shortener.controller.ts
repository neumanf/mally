import { Body, Controller, Get, NotFoundException, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { CreateShortUrlDto } from './DTOs/create-short-url.dto';
import { UrlShortenerService } from './url-shortener.service';

@Controller('url-shortener')
export class UrlShortenerController {
    constructor(private readonly urlShortnerService: UrlShortenerService) {}

    @Post()
    async createShortUrl(@Body() createShortUrlDto: CreateShortUrlDto) {
        const url = await this.urlShortnerService.createShortUrl(createShortUrlDto.url);
        return { short_url: url };
    }

    @Get()
    async redirectUrl(@Res() response: Response, @Query('url') shortUrl: string) {
        const url = await this.urlShortnerService.findLongUrl(shortUrl);

        if (!url) throw new NotFoundException('URL not found.');

        return response.redirect(url);
    }
}
