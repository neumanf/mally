import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('jwtSecret'),
                signOptions: { expiresIn: '60s' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, UsersService, PrismaService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
