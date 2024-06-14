import mongoose, { Document, Schema } from 'mongoose';

// Define the Client interface extending mongoose.Document
export interface IClient extends Document {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture: string;
}

// Define the schema
const clientSchema: Schema<IClient> = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    }
});

// Adding a pre-save hook to update the `updatedAt` field
clientSchema.pre<IClient>('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Create and export the model
const Client = mongoose.model<IClient>('Client', clientSchema);
export default Client;
