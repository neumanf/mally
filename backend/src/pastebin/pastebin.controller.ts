import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
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
import { FindPastesByUserIdDto } from './DTOs/find-pastes-by-user-id.dto';

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

    @UseGuards(JwtAuthGuard)
    @Get()
    async findPastes(
        @Req() request: Request,
        @Query() { page = '1', take = '10', search = '' }: FindPastesByUserIdDto
    ): Promise<Paste[]> {
        const user = request.user as JwtResponse;
        return this.pastebinService.findPastesByUserId(user.id, +page, +take, search);
    }

    @Get(':slug')
    async findPaste(@Param('slug') slug: string): Promise<Paste> {
        const paste = await this.pastebinService.findPaste(slug);

        if (!paste) throw new NotFoundException('Paste not found.');

        return paste;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deletePaste(@Param('id') id: string) {
        const deleted = await this.pastebinService.deletePaste(+id);

        if (!deleted) throw new NotFoundException();

        return { ok: true };
    }
}
