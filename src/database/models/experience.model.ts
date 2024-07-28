import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    title: string;
    company: string;
    location: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    user: mongoose.Schema.Types.ObjectId;
}

const experienceSchema: Schema = new Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Experience = mongoose.model<IExperience>('Experience', experienceSchema);

export default Experience;
