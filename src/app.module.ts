import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // .env dosyasından ayarları almak için
    MongooseModule.forRoot(process.env.MONGODB_URI), // Veritabanı bağlantısı
    UserModule, // User modülü
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
