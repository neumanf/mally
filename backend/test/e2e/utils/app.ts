import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';

export async function createAppFixture() {
    const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({ origin: 'http://localhost', credentials: true });

    return app;
}

export async function getAuthCookie(app: INestApplication) {
    const loginResponse = await request(app.getHttpServer()).post('/api/auth/login').send({
        username: 'user1@mail.com',
        password: '0123456789',
    });

    return loginResponse.headers['set-cookie'];
}
