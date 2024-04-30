import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
    _id: string;
    title: string;
}

const skillSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: false, // Ensure unique is set to false to allow duplicate titles
    },
});

// Create a model using the schema
const Skill = mongoose.model<ISkill>('Skill', skillSchema);

export default Skill;
