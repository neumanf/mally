import { Module } from '@nestjs/common';

import { PastebinController } from './pastebin.controller';
import { PastebinService } from './pastebin.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [PastebinController],
    providers: [PastebinService, PrismaService],
})
export class PastebinModule {}
