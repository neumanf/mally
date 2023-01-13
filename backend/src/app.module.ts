import { Module } from '@nestjs/common';

import { UrlShortnerModule } from './url-shortner/url-shortner.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
    imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true }), UrlShortnerModule],
    providers: [PrismaService],
})
export class AppModule {}
