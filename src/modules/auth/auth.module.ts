import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy'; // LocalStrategy burada tanımlanıyor
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.contoller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy], // LocalStrategy ve JwtStrategy eklendi
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
