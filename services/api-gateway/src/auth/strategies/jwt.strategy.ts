import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      issuer: 'autopilot.monster',
      audience: 'autopilot.monster',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Validate token with auth service
      const validation = await this.authService.validateToken(
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      );

      if (!validation.isValid) {
        throw new UnauthorizedException('Invalid token');
      }

      // Return user object that will be attached to request
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
