import mongoose, { Schema, Document } from 'mongoose';

export type SocialData = {
    url: string;
    icon: string;
    name: string;
};

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    resume: string;
    profilePicture: string;
    socialData: SocialData[];
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    isEmailVerified: boolean;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
        unique: true,
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
    isAdmin: {
        type: Boolean,
        default: false,
    },
    resume: {
        type: String,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    socialData: {
        type: Array<SocialData>,
        default: []
    },
});
// create a model using the schema


const User = mongoose.model<IUser>('User', userSchema);

export default User;
