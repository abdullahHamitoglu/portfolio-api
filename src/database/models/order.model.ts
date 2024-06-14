import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    project: string;
    quantity: number;
    price: number;
    userId: mongoose.Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema: Schema = new Schema({
    project: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Pending', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
