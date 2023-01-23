import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MySqlContainer, StartedMySqlContainer } from 'testcontainers';
import { PrismaClient, User } from '@prisma/client';

import { getDatabaseUrl } from './utils/database';
import { createAppFixture, getAuthCookie } from './utils/app';

describe('PastebinController (e2e)', () => {
    let app: INestApplication;
    let container: StartedMySqlContainer;
    let prisma: PrismaClient;
    let user: User;

    beforeAll(async () => {
        container = await new MySqlContainer('mysql:8.0').start();
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

        it('should return not found when it does not exists', async () => {
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

            expect(response.status).toEqual(HttpStatus.OK);
        });

        it('should return not found when it does not exists', async () => {
            const response = await request(app.getHttpServer())
                .delete('/api/pastebin/1')
                .set('Cookie', await getAuthCookie(app));

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        });
    });
});
