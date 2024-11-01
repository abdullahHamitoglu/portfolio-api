import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as jwt from 'jsonwebtoken';

export const userProfile = (user: User) => {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    profile_picture: user.profile_picture,
    email_verified: user.email_verified,
    resume: user.resume,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    is_admin: user.is_admin,
    domain: user.domain,
  };
};

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'Profile fetched successfully',
      user: userProfile(user),
      status: 200,
    };
  }

  async getUsers() {
    return this.userModel.find();
  }

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'User fetched successfully',
      user: userProfile(user),
      status: 200,
    };
  }

  async createUser(createUserDto: any) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) throw new Error('Email already exists');

    const newUser = new this.userModel(createUserDto);
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '24h',
    });

    return {
      message: 'User created successfully',
      user: userProfile(newUser),
      token,
      status: 200,
    };
  }

  async updateUser(userId: string, updateData: any) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'User updated successfully',
      user: userProfile(user),
      status: 200,
    };
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'User deleted successfully',
      user: userProfile(user),
      status: 200,
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email });
  }
}
