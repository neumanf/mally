import { Module } from '@nestjs/common';

import { UrlShortnerController } from './url-shortner.controller';
import { UrlShortnerService } from './url-shortner.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [UrlShortnerController],
    providers: [UrlShortnerService, PrismaService],
})
export class UrlShortnerModule {}
