import { Controller, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';

import { SignUpDto } from './DTOs/signUpDto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtResponse } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const login = await this.authService.login(req.user as JwtResponse);
        res.cookie('accessToken', login.accessToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return login;
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        await this.userService.create(signUpDto);
        return { ok: true };
    }
}
