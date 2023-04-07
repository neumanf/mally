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
import { FindShortUrlsByUserIdDto } from './DTOs/find-short-urls-by-user-id.dto';

@Controller('url-shortener')
export class UrlShortenerController {
    constructor(private readonly urlShortnerService: UrlShortenerService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createShortUrl(@Req() request: Request, @Body() createShortUrlDto: CreateShortUrlDto) {
        const user = request.user as JwtResponse;
        return this.urlShortnerService.createShortUrl(createShortUrlDto.url, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findShortUrls(
        @Req() request: Request,
        @Query() { page = '1', take = '10', search = '' }: FindShortUrlsByUserIdDto
    ): Promise<Url[]> {
        const user = request.user as JwtResponse;
        return this.urlShortnerService.findShortUrlsByUserId(user.id, +page, +take, search);
    }

    @Get('/redirect')
    async redirectUrl(@Res() response: Response, @Query('slug') slug: string) {
        const url = await this.urlShortnerService.findLongUrl(slug);

        if (!url) throw new NotFoundException('URL not found.');

        return response.status(303).redirect(url);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteShortUrl(@Param('id') id: string) {
        const deleted = await this.urlShortnerService.deleteShortUrl(+id);

        if (!deleted) throw new NotFoundException();

        return { ok: true };
    }
}
