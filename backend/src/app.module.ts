import { Module } from '@nestjs/common';

import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PastebinModule } from './pastebin/pastebin.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import configuration from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        UrlShortenerModule,
        PastebinModule,
        AuthModule,
        UsersModule,
        StatsModule,
    ],
    providers: [PrismaService],
})
export class AppModule {}
