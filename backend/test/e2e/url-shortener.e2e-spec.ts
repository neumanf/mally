import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { StartedPostgreSqlContainer } from 'testcontainers';

import { createAppFixture, getAuthCookie } from './utils/app';
import { postgresContainer } from './utils/containers';
import { getDatabaseUrl } from './utils/database';

describe('UrlShortenerController', () => {
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

    describe('POST /api/url-shortener', () => {
        it('should return unauthorized when user is not logged in', async () => {
            const response = await request(app.getHttpServer()).post('/api/url-shortener').send({
                url: 'http://any-url.com',
            });

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should create short url when data is valid and user is logged in', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/url-shortener')
                .send({
                    url: 'http://any-url.com',
                })
                .set('Cookie', await getAuthCookie(app));
            const pastesCount = await prisma.url.count();

            expect(response.status).toEqual(HttpStatus.CREATED);
            expect(pastesCount).toEqual(1);
            expect(response.body.slug).toBeDefined();
        });
    });

    describe('GET /api/url-shortener', () => {
        it('should return unauthorized when user is not logged in', async () => {
            const response = await request(app.getHttpServer()).get('/api/url-shortener');

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should return all short urls when user is logged in', async () => {
            const url = {
                url: 'http://any-url.com',
                slug: 'any-slug',
                userId: user.id,
            };
            await prisma.url.create({
                data: url,
            });
            const response = await request(app.getHttpServer())
                .get('/api/url-shortener')
                .set('Cookie', await getAuthCookie(app));

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toMatchObject(url);
        });
    });

    describe('GET /api/url-shortener/redirect', () => {
        it('should redirect user to the original url', async () => {
            const url = {
                url: 'http://any-url.com',
                slug: 'any-slug',
                userId: user.id,
            };
            await prisma.url.create({
                data: url,
            });
            const response = await request(app.getHttpServer()).get(
                '/api/url-shortener/redirect?slug=any-slug'
            );

            expect(response.status).toEqual(HttpStatus.FOUND);
            expect(response.redirect).toBeDefined();
        });

        it('should return not found when slug does not exists', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/url-shortener/redirect?slug=slug-does-not-exist'
            );

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    describe('DELETE /api/url-shortener/:id', () => {
        it('should delete url when it exists', async () => {
            const url = {
                url: 'http://any-url.com',
                slug: 'any-slug',
                userId: user.id,
            };
            const createdUrl = await prisma.url.create({
                data: url,
            });
            const response = await request(app.getHttpServer())
                .delete(`/api/url-shortener/${createdUrl.id}`)
                .set('Cookie', await getAuthCookie(app));
            const urlCount = await prisma.url.count();

            expect(response.status).toEqual(HttpStatus.OK);
            expect(urlCount).toEqual(0);
        });

        it('should return not found when it does not exists', async () => {
            const response = await request(app.getHttpServer())
                .delete('/api/url-shortener/1')
                .set('Cookie', await getAuthCookie(app));

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        });
    });
});
