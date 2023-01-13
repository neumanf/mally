import { Module } from '@nestjs/common';

import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
    imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true }), UrlShortenerModule],
    providers: [PrismaService],
})
export class AppModule {}
