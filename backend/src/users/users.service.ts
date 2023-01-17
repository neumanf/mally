import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from '../auth/DTOs/signUpDto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(signupDto: SignUpDto) {
        const password = await bcrypt.hash(signupDto.password, 10);
        const user = { ...signupDto, password };

        return this.prismaService.user.create({ data: user });
    }

    async findOne(email: string) {
        return this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });
    }
}
