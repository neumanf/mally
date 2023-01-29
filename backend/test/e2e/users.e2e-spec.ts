import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createAppFixture, getAuthCookie } from './utils/app';
import { StartedPostgreSqlContainer } from 'testcontainers';
import { PrismaClient, User } from '@prisma/client';
import { postgresContainer } from './utils/containers';
import { getDatabaseUrl } from './utils/database';

describe('UsersController', () => {
    let app: INestApplication;
    let startedPostgresContainer: StartedPostgreSqlContainer;
    let prisma: PrismaClient;

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
        await prisma.user.create({
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

    describe('GET /api/users/me', () => {
        it('should return unauthorized when user is not logged in', async () => {
            const response = await request(app.getHttpServer()).get('/api/users/me');

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should return user info when it is logged in', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/users/me')
                .set('Cookie', await getAuthCookie(app));

            expect(response.status).toEqual(HttpStatus.OK);
        });
    });
});
