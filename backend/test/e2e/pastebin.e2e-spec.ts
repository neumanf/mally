import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { StartedPostgreSqlContainer } from 'testcontainers';
import { PrismaClient, User } from '@prisma/client';

import { createAppFixture, getAuthCookie } from './utils/app';
import { postgresContainer } from './utils/containers';
import { getDatabaseUrl } from './utils/database';

describe('PastebinController', () => {
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

    describe('POST /api/pastebin', () => {
        it('should return unauthorized when user is not logged in', async () => {
            const response = await request(app.getHttpServer()).post('/api/pastebin').send({
                content: "console.log('hello, world')",
                syntax: 'javascript',
            });

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should create pastebin when data is valid and user is logged in', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/pastebin')
                .send({
                    content: "console.log('hello, world')",
                    syntax: 'javascript',
                })
                .set('Cookie', await getAuthCookie(app));
            const pastesCount = await prisma.paste.count();

            expect(response.status).toEqual(HttpStatus.CREATED);
            expect(pastesCount).toEqual(1);
        });

        it('should create a paste with title when title is provided', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/pastebin')
                .send({
                    title: 'my title',
                    content: 'paste with title',
                    syntax: 'text',
                })
                .set('Cookie', await getAuthCookie(app));
            const pasteExists = await prisma.paste.findFirst({
                where: {
                    title: 'my title',
                },
            });

            expect(response.status).toEqual(HttpStatus.CREATED);
            expect(pasteExists).toBeTruthy();
        });
    });

    describe('GET /api/pastebin', () => {
        it('should return unauthorized when user is not logged in', async () => {
            const response = await request(app.getHttpServer()).get('/api/pastebin');

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

        it('should return all pastes when user is logged in', async () => {
            const paste = {
                content: "console.log('hello, world')",
                syntax: 'javascript',
                slug: 'any-slug',
                userId: user.id,
            };
            await prisma.paste.create({
                data: paste,
            });
            const response = await request(app.getHttpServer())
                .get('/api/pastebin')
                .set('Cookie', await getAuthCookie(app));

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toMatchObject(paste);
        });
    });

    describe('GET /api/pastebin/:slug', () => {
        it('should return paste when it exists', async () => {
            const paste = {
                content: "console.log('hello, world')",
                syntax: 'javascript',
                slug: 'any-slug',
                userId: user.id,
            };
            await prisma.paste.create({
                data: paste,
            });
            const response = await request(app.getHttpServer()).get('/api/pastebin/any-slug');

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.body).toMatchObject(paste);
        });

        it('should return not found when paste does not exists', async () => {
            const response = await request(app.getHttpServer()).get('/api/pastebin/any-slug');

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        });

        it('should return a paste with expiration time when it has not expired yet', async () => {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1);
            const paste = {
                content: "console.log('hello, world')",
                syntax: 'javascript',
                slug: 'any-slug',
                expiresAt: expirationDate.toISOString(),
                userId: user.id,
            };
            await prisma.paste.create({
                data: paste,
            });
            const response = await request(app.getHttpServer()).get('/api/pastebin/any-slug');

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.body).toMatchObject(paste);
        });

        it('should not return a paste that has expired', async () => {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() - 1);
            const paste = {
                content: "console.log('hello, world')",
                syntax: 'javascript',
                slug: 'any-slug',
                expiresAt: expirationDate,
                userId: user.id,
            };
            await prisma.paste.create({
                data: paste,
            });
            const response = await request(app.getHttpServer()).get('/api/pastebin/any-slug');

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    describe('DELETE /api/pastebin/:id', () => {
        it('should delete paste when it exists', async () => {
            const paste = {
                content: "console.log('hello, world')",
                syntax: 'javascript',
                slug: 'any-slug',
                userId: user.id,
            };
            const createdPaste = await prisma.paste.create({
                data: paste,
            });
            const response = await request(app.getHttpServer())
                .delete(`/api/pastebin/${createdPaste.id}`)
                .set('Cookie', await getAuthCookie(app));
            const pastesCount = await prisma.paste.count();

            expect(response.status).toEqual(HttpStatus.OK);
            expect(pastesCount).toEqual(0);
        });

        it('should return not found when it does not exists', async () => {
            const response = await request(app.getHttpServer())
                .delete('/api/pastebin/1')
                .set('Cookie', await getAuthCookie(app));

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        });
    });
});
