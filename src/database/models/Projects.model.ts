import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    updatedAt: any;
    createdAt: any;
    active: string;
    title: string;
    description: string;
    background: string;
    images: string[];
    status: string;
    featured: Boolean
}

const projectSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide title"],
        unique: false, // Ensure unique is set to false to allow duplicate titles
    },
    description: {
        type: String,
        required: false,
        unique: false,
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
    client:{
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
});

// Create a model using the schema
const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
