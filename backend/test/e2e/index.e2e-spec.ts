import { PrismaClient, User } from '@prisma/client';
import { StartedMySqlContainer } from 'testcontainers';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { mySqlContainer } from './utils/containers';
import { getDatabaseUrl } from './utils/database';
import { createAppFixture, getAuthCookie } from './utils/app';

describe('E2E Tests', () => {
    let app: INestApplication;
    let startedMySqlContainer: StartedMySqlContainer;
    let prisma: PrismaClient;
    let user: User;

    beforeAll(async () => {
        startedMySqlContainer = await mySqlContainer.start();
        const databaseUrl = getDatabaseUrl(startedMySqlContainer);
        prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await startedMySqlContainer.stop();
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

    describe('AuthController', () => {
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

    describe('PastebinController', () => {
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

            it('should return not found when paste does not exists', async () => {
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

    describe('UrlShortenerController', () => {
        describe('POST /api/url-shortener', () => {
            it('should return unauthorized when user is not logged in', async () => {
                const response = await request(app.getHttpServer())
                    .post('/api/url-shortener')
                    .send({
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

    describe('UsersController', () => {
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

    describe('StatsController', () => {
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
});
