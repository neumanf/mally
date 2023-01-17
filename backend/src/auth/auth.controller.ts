import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SignUpDto } from './DTO/signUpDto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        await this.userService.create(signUpDto);
        return { ok: true };
    }
}
