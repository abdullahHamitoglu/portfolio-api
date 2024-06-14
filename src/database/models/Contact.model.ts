import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const contactMessageSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);

export default ContactMessage;
