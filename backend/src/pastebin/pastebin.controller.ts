import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Paste } from '@prisma/client';

import { PastebinService } from './pastebin.service';
import { CreatePasteDto } from './DTOs/create-paste.dto';
import { Request } from 'express';
import { JwtResponse } from '../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pastebin')
export class PastebinController {
    constructor(private readonly pastebinService: PastebinService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPaste(
        @Req() request: Request,
        @Body() createPasteDto: CreatePasteDto
    ): Promise<Paste> {
        const user = request.user as JwtResponse;
        return this.pastebinService.createPaste(createPasteDto, user.id);
    }

    @Get()
    async findPaste(@Query('slug') slug: string): Promise<Paste> {
        const paste = await this.pastebinService.findPaste(slug);

        if (!paste) throw new NotFoundException('Paste not found.');

        return paste;
    }
}
