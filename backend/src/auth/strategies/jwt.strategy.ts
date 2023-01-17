import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwtSecret'),
        });
    }

    async validate(payload: JwtPayload): Promise<JwtResponse> {
        return { id: payload.sub, email: payload.email };
    }
}
