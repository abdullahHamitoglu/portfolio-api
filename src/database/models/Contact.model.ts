import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from './category.model';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    message: string;
    service: ICategory;
    createdAt: Date;
    updatedAt: Date;
}

const contactMessageSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);

export default ContactMessage;
