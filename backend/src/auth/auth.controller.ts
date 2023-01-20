import { Controller, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { SignUpDto } from './DTOs/signUpDto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtResponse } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly configService: ConfigService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const login = await this.authService.login(req.user as JwtResponse);
        const isProd = this.configService.get('nodeEnv') === 'production';
        res.cookie('accessToken', login.access_token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'none',
            secure: isProd,
            domain: isProd ? 'vercel.app' : 'localhost',
        });
        res.cookie('test1', 'test1', {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'none',
            secure: isProd,
            domain: isProd ? '.vercel.app' : 'localhost',
        });
        res.cookie('test2', 'test2', {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'none',
            secure: isProd,
            domain: isProd ? 'mally.vercel.app' : 'localhost',
        });
        res.cookie('test3', 'test3', {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'none',
            secure: isProd,
            domain: isProd ? 'https://mally.vercel.app' : 'localhost',
        });
        res.cookie('test4', 'test4', {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'none',
            secure: isProd,
            domain: isProd ? 'vercel.app' : 'localhost',
        });
        return login;
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        await this.userService.create(signUpDto);
        return { ok: true };
    }
}
