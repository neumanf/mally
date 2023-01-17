import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);

        console.log(user);

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) return null;

        const { password: _, ...result } = user;

        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
