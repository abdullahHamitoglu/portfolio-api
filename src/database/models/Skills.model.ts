import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
    _id: string;
    title: string;
    image: string;
    user: mongoose.Schema.Types.ObjectId;
}

const skillSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: false, // Ensure unique is set to false to allow duplicate titles
    },
    image: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Create a model using the schema
const Skill = mongoose.model<ISkill>('Skill', skillSchema);

export default Skill;
