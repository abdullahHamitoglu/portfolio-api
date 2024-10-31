import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Mongoose kullanıyorsan
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export ediliyor ki diğer modüller de kullanabilsin
})
export class UserModule {}
