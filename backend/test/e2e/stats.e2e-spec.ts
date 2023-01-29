import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { StartedPostgreSqlContainer } from 'testcontainers';
import { PrismaClient, User } from '@prisma/client';

import { createAppFixture, getAuthCookie } from './utils/app';
import { postgresContainer } from './utils/containers';
import { getDatabaseUrl } from './utils/database';

describe('StatsController', () => {
    let app: INestApplication;
    let startedPostgresContainer: StartedPostgreSqlContainer;
    let prisma: PrismaClient;
    let user: User;

    beforeAll(async () => {
        startedPostgresContainer = await postgresContainer.start();
        const databaseUrl = getDatabaseUrl(startedPostgresContainer);
        prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await startedPostgresContainer.stop();
        await app.close();
    });

    beforeEach(async () => {
        app = await createAppFixture();
        user = await prisma.user.create({
            data: {
                name: 'user1',
                email: 'user1@mail.com',
                password: '$2b$10$znjV3GXrzpBVLbz.5XX22.Xl.BNFjzurs1ap50dBV5jNuHNg2zN4K',
            },
        });
        await app.init();
    });

    afterEach(async () => {
        await prisma.$transaction([
            prisma.user.deleteMany(),
            prisma.paste.deleteMany(),
            prisma.url.deleteMany(),
        ]);
    });

    describe('GET /api/stats', () => {
        it('should return unauthorized when user is not logged in', async () => {
            const response = await request(app.getHttpServer()).get('/api/stats');

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should return all stats when user is logged in', async () => {
            await prisma.$transaction([
                prisma.url.create({
                    data: {
                        url: 'http://any-url.com',
                        shortUrl: 'http://website.com/s/any-slug',
                        userId: user.id,
                    },
                }),
                prisma.paste.create({
                    data: {
                        content: "console.log('hello, world')",
                        syntax: 'javascript',
                        slug: 'any-slug',
                        userId: user.id,
                    },
                }),
            ]);
            const response = await request(app.getHttpServer())
                .get('/api/stats')
                .set('Cookie', await getAuthCookie(app));

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.body.urls.count).toEqual(1);
            expect(response.body.pastes.count).toEqual(1);
        });
    });
});
