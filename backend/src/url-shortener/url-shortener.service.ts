import { Injectable } from '@nestjs/common';
import * as cuid from 'cuid';
import { Url } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UrlShortenerService {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {}

    async createShortUrl(url: string, userId?: number): Promise<string> {
        const slug = cuid.slug();
        const baseUrl = this.configService.get('frontendUrl');
        const shortUrl = `${baseUrl}/s/${slug}`;

        await this.prisma.url.create({
            data: {
                url,
                shortUrl,
                userId,
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

    async findShortUrlsByUserId(id: number): Promise<Url[]> {
        return this.prisma.url.findMany({
            where: {
                userId: id,
            },
        });
    }

    async deleteShortUrl(id: number): Promise<boolean> {
        try {
            await this.prisma.url.delete({
                where: {
                    id: id,
                },
            });
            return true;
        } catch (e) {
            return false;
        }
    }
}
