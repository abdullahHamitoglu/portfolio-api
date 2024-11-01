import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    background: string;
    images: string[];
}

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: false, // Ensure unique is set to false to allow duplicate titles
    },
    description: {
        type: String,
        required: false,
        unique: false,
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
});

// Create a model using the schema
const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
