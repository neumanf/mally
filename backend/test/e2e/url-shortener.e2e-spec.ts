import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StartedMySqlContainer } from 'testcontainers';
import { PrismaClient, User } from '@prisma/client';

import { getDatabaseUrl } from './utils/database';
import { createAppFixture, getAuthCookie } from './utils/app';
import { mySqlContainer } from './utils/container';

describe('UrlShortenerController (e2e)', () => {
    let app: INestApplication;
    let container: StartedMySqlContainer;
    let prisma: PrismaClient;
    let user: User;

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
        user = await prisma.user.create({
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

    describe('POST /api/url-shortener', () => {
        it('should return unauthorized when user is not logged in', async () => {
            const response = await request(app.getHttpServer()).post('/api/url-shortener').send({
                url: 'http://any-url.com',
            });

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should create pastebin when data is valid and user is logged in', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/url-shortener')
                .send({
                    url: 'http://any-url.com',
                })
                .set('Cookie', await getAuthCookie(app));
            const pastesCount = await prisma.url.count();

            expect(response.status).toEqual(HttpStatus.CREATED);
            expect(pastesCount).toEqual(1);
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
                shortUrl: 'http://website.com/s/any-slug',
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
                shortUrl: 'http://website.com/s/any-slug',
                userId: user.id,
            };
            await prisma.url.create({
                data: url,
            });
            const response = await request(app.getHttpServer()).get(
                '/api/url-shortener/redirect?url=http://website.com/s/any-slug'
            );

            expect(response.status).toEqual(HttpStatus.FOUND);
            expect(response.redirect).toBeDefined();
        });

        it('should return not found when url does not exists', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/url-shortener/redirect?url=http://not-existing-url.com'
            );

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    describe('DELETE /api/url-shortener/:id', () => {
        it('should delete url when it exists', async () => {
            const url = {
                url: 'http://any-url.com',
                shortUrl: 'http://website.com/s/any-slug',
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
