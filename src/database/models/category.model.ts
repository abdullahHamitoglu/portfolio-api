import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: { en: string, ar?: string, tr?: string };
    description?: { en: string, ar: string, tr: string };
    featured?: Boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: mongoose.Schema.Types.ObjectId;
}

const categorySchema: Schema = new Schema({
    name: {
        en: { type: String, required: true },
        ar: { type: String },
        tr: { type: String }
    },
    description: {
        en: { type: String },
        ar: { type: String },
        tr: { type: String }
    },
    featured: { type: Boolean, default: false },
    status: { type: String, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;


