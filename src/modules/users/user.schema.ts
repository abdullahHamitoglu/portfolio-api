import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: false })
  _id: string;

  @Prop()
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  profile_picture: string;

  @Prop({ default: false })
  is_admin: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  email_verified: boolean;

  @Prop({ default: false })
  phone_verified: boolean;

  @Prop({
    enum: ['admin', 'customer', 'editor', 'general'],
    default: 'customer',
  })
  role: string;

  @Prop()
  resume: string;

  @Prop()
  domain: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
