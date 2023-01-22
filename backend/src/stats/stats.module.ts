import { Module } from '@nestjs/common';

import { StatsController } from './stats.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [StatsController],
    providers: [PrismaService],
})
export class StatsModule {}
