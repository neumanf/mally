import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StartedMySqlContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';

import { getDatabaseUrl } from './utils/database';
import { createAppFixture } from './utils/app';
import { mySqlContainer } from './utils/container';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let container: StartedMySqlContainer;
    let prisma: PrismaClient;

    beforeAll(async () => {
        container = await mySqlContainer.start();
        const databaseUrl = getDatabaseUrl(container);
        prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await container.stop();
        await app.close();
    });

    beforeEach(async () => {
        app = await createAppFixture();
        await app.init();
        await prisma.user.create({
            data: {
                name: 'user1',
                email: 'user1@mail.com',
                password: '$2b$10$znjV3GXrzpBVLbz.5XX22.Xl.BNFjzurs1ap50dBV5jNuHNg2zN4K',
            },
        });
    });

    afterEach(async () => {
        await prisma.$transaction([
            prisma.user.deleteMany(),
            prisma.paste.deleteMany(),
            prisma.url.deleteMany(),
        ]);
    });

    describe('POST /api/auth/login', () => {
        it('should return not authorized when credentials do not match', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({ username: 'user1@mail.com', password: 'unknown' });

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should return ok and store the token in a cookie when credentials are valid', async () => {
            const response = await request(app.getHttpServer()).post('/api/auth/login').send({
                username: 'user1@mail.com',
                password: '0123456789',
            });

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.header['set-cookie'][0]).toMatch('accessToken');
        });
    });

    describe('POST /api/auth/signup', () => {
        it('should create a user when credentials are valid', async () => {
            const response = await request(app.getHttpServer()).post('/api/auth/signup').send({
                name: 'user2',
                email: 'user2@mail.com',
                password: '0123456789',
            });
            const userCreated = await prisma.user.findUnique({
                where: { email: 'user2@mail.com' },
            });

            expect(response.status).toEqual(HttpStatus.CREATED);
            expect(userCreated).toBeDefined();
        });

        it('should return bad request when credentials are not valid', async () => {
            const response = await request(app.getHttpServer()).post('/api/auth/signup').send({
                name: 'user3',
                email: 'not-a-email',
                password: '0123456789',
            });

            expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        });
    });
});
