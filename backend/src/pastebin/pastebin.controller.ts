import { Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { Paste } from '@prisma/client';

import { PastebinService } from './pastebin.service';
import { CreatePasteDto } from './DTOs/create-paste.dto';

@Controller('pastebin')
export class PastebinController {
    constructor(private readonly pastebinService: PastebinService) {}

    @Post()
    async createPaste(@Body() createPasteDto: CreatePasteDto): Promise<Paste> {
        return this.pastebinService.createPaste(createPasteDto);
    }

    @Get()
    async findPaste(@Query('slug') slug: string): Promise<Paste> {
        const paste = await this.pastebinService.findPaste(slug);

        if (!paste) throw new NotFoundException('Paste not found.');

        return paste;
    }
}
