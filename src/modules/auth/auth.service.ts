import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userProfile, UserService } from '../users/user.service'; // Kullanıcı servisi ile iletişim
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // Kullanıcıyı doğrulama
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email); // Email ile kullanıcıyı bul
    if (user && user.password === password) {
      // Şifre doğrulaması (Hash kullanılmalı)
      const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result; // Şifre hariç diğer bilgiler döndürülür
    }
    return null; // Kullanıcı bulunamazsa veya şifre yanlışsa null döner
  }

  // Token üretme
  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      message: 'Login successful',
      user: {
        ...userProfile(user),
        token: this.jwtService.sign(payload),
      },
      token: this.jwtService.sign(payload),
    };
  }

  // Token doğrulama
  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
