import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({ origin: configService.get('frontendUrl'), credentials: true });

    await app.listen(configService.get('port'));
}
bootstrap();
