import { Injectable } from '@nestjs/common';
import * as cuid from 'cuid';

import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlShortenerService {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {}

    async createShortUrl(url: string): Promise<string> {
        const slug = cuid.slug();
        const baseUrl = this.configService.get('frontendUrl');
        const shortUrl = `${baseUrl}/s/${slug}`;

        await this.prisma.url.create({
            data: {
                url,
                shortUrl,
            },
        });

        return shortUrl;
    }

    async findLongUrl(shortUrl: string): Promise<string> {
        const result = await this.prisma.url.findUnique({
            where: {
                shortUrl: shortUrl,
            },
        });

        return !!result ? result.url : '';
    }
}
