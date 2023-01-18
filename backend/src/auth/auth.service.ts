import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { JwtResponse } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
        const user = await this.usersService.findOne(email);

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) return null;

        const { password: _, ...result } = user;

        return result;
    }

    async login(user: JwtResponse) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
