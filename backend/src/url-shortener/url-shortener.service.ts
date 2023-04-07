import { Injectable } from '@nestjs/common';
import * as cuid from 'cuid';
import { Prisma, Url } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UrlShortenerService {
    constructor(private readonly prisma: PrismaService) {}

    async createShortUrl(url: string, userId?: number): Promise<Url> {
        const slug = cuid.slug();

        return this.prisma.url.create({
            data: {
                url,
                slug,
                userId,
            },
        });
    }

    async findLongUrl(slug: string): Promise<string> {
        const result = await this.prisma.url.findUnique({
            where: {
                slug: slug,
            },
        });

        return !!result ? result.url : '';
    }

    async findShortUrlsByUserId(id: number, page: number, take: number, search): Promise<Url[]> {
        const query: Prisma.UrlWhereInput = {
            userId: id,
        };

        if (search) {
            query.url = {
                search,
            };
        }

        return this.prisma.url.findMany({
            where: query,
            take,
            skip: (page - 1) * take,
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
