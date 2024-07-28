import { LocaleKeys } from 'index';
import mongoose, { Schema, Document } from 'mongoose';
import { validate } from 'uuid';

export interface IProject extends Document {
    updatedAt: Date;
    createdAt: Date;
    title: { [key in LocaleKeys]: string };
    description: { [key in LocaleKeys]?: string };
    background: string;     
    images: string[];
    status: string;
    featured: boolean;
    category: string | object;
    user: string | object;
}

const projectSchema = new Schema({
    title: {
        en: {
            type: String,
            required: [true, "Please provide title in English"],
            unique: false,
        },
        ar: {
            type: String,
            required: false,
            unique: false,
        },
        tr: {
            type: String,
            required: false,
            unique: false,
        },
    },
    description: {
        en: {
            type: String,
            required: false,
            unique: false,
        },
        ar: {
            type: String,
            required: false,
            unique: false,
        },
        tr: {
            type: String,
            required: false,
            unique: false,
        },
    },
    status: {
        type: String,
        required: [true, 'Please provide status'],
        unique: false,
    },
    featured: {
        type: Boolean,
        required: false,
        unique: false,
        default: false,
    },
    background: {
        type: String,
        required: false,
        unique: false,
    },
    images: {
        type: [String],
        required: false,
        unique: false,
    },
    client: {
        type: String,
        required: false,
        unique: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

// Create a model using the schema
const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
