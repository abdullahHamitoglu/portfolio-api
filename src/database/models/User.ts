import mongoose, { Schema, Document } from 'mongoose';
type socialMedia = {
    type: string;
    title?: string;
    link: string;
}
export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    resume: string;
    profilePicture: string;
    contactsData: Array<socialMedia>;
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
    contactsData: {
        type: Array<socialMedia>,
        default: [],
    },
});
// create a model using the schema


const User = mongoose.model<IUser>('User', userSchema);

export default User;
