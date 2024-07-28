import mongoose from 'mongoose';

type customerSchema ={
    user: mongoose.Schema.Types.ObjectId;
}

const customerSchema = new mongoose.Schema({
    user: {
        // Assuming 'User' is the name of the related model
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: false
    }
});

const customer = mongoose.model('customer', customerSchema);

export default customer;
