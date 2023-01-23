import { Controller, Post, UseGuards, Req, Res, Body, HttpStatus, HttpCode } from '@nestjs/common';
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
    @HttpCode(HttpStatus.OK)
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const login = await this.authService.login(req.user as JwtResponse);
        const cookieDomain = this.configService.get('cookieDomain');
        res.cookie('accessToken', login.accessToken, {
            maxAge: 1000 * 60 * 60, // 1h
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            domain: cookieDomain,
        });
        return login;
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        await this.userService.create(signUpDto);
        return { ok: true };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        res.cookie('accessToken', req.cookies.accessToken, {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return { ok: true };
    }
}
