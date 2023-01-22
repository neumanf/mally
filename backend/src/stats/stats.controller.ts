import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtResponse } from '../auth/strategies/jwt.strategy';

@Controller('stats')
export class StatsController {
    constructor(private readonly prismaService: PrismaService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getStats(@Req() request: Request) {
        const user = request.user as JwtResponse;
        const [urlCount, pasteCount] = await Promise.all([
            this.prismaService.url.count({
                where: {
                    userId: user.id,
                },
            }),
            this.prismaService.paste.count({
                where: {
                    userId: user.id,
                },
            }),
        ]);

        return {
            urls: {
                count: urlCount,
            },
            pastes: {
                count: pasteCount,
            },
        };
    }
}
