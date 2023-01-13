import { Module } from '@nestjs/common';

import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [UrlShortenerController],
    providers: [UrlShortenerService, PrismaService],
})
export class UrlShortenerModule {}
