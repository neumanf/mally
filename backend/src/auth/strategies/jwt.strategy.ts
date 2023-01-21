import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export type JwtPayload = {
    sub: number;
    email: string;
    iat: number;
    exp: number;
};

export type JwtResponse = {
    id: number;
    email: string;
};

function extractJwtFromCookie(req: Request) {
    return req && req.cookies ? req.cookies['accessToken'] : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwtSecret'),
        });
    }

    async validate(payload: JwtPayload): Promise<JwtResponse> {
        return { id: payload.sub, email: payload.email };
    }
}
