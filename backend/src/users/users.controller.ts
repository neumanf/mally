import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getMe(@Req() request: Request) {
        return request.user;
    }
}
