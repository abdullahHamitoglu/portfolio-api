import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // JWT_SECRET'i ConfigService'den alıyoruz
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token, Authorization başlığından alınır
      ignoreExpiration: false, // Token süresini kontrol et
      secretOrKey: configService.get<string>('JWT_SECRET'), // .env dosyasındaki secret key
    });
  }

  // JWT doğrulandıktan sonra çalışır
  async validate(payload: any) {
    const user = await this.authService.validateToken(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
