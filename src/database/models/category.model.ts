import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description?: string;
    featured?: Boolean;
    status: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    featured: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;


