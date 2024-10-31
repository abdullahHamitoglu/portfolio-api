import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './modules/projects/project.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env dosyasından ayarları almak için
    MongooseModule.forRoot(process.env.MONGODB_URI), // Veritabanı bağlantısı
    UserModule,
    ProjectModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
