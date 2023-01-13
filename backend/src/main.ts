import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api');
    app.enableCors({ origin: configService.get('frontendUrl') });

    await app.listen(configService.get('port'));
}
bootstrap();
