import { Injectable } from '@nestjs/common';
import * as cuid from 'cuid';
import { Paste } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePasteDto } from './DTOs/create-paste.dto';

@Injectable()
export class PastebinService {
    constructor(private readonly prisma: PrismaService) {}

    async createPaste(paste: CreatePasteDto): Promise<Paste> {
        return this.prisma.paste.create({
            data: {
                content: paste.content,
                syntax: paste.syntax,
                slug: cuid(),
            },
        });
    }

    async findPaste(slug: string): Promise<Paste> {
        return this.prisma.paste.findUnique({
            where: {
                slug: slug,
            },
        });
    }
}
