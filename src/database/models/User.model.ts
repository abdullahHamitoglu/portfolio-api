import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    resume: string;
    profile_picture: string;
    domain: string;
    is_admin: boolean;
    createdAt: Date;
    updatedAt: Date;
    email_verified: boolean;
    phone_verified: boolean;
    role: 'admin' | 'customer' | 'editor' | 'general';
}

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
    resume: {
        type: String,
        default: null,
    },
    profile_picture: {
        type: String,
        default: null,
    },
    domain: {
        type: String,
        default: null,
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    phone_verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'editor', 'general'],
        default: 'customer',
    }
});


const User = mongoose.model<IUser>('User', userSchema);

export default User;
