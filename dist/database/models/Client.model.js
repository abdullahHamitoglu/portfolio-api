"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const clientSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User',
        required: false
    }
});
clientSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
const Client = mongoose_1.default.model('Client', clientSchema);
exports.default = Client;
//# sourceMappingURL=client.model.js.map