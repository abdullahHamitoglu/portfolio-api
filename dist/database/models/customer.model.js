"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User',
        required: false
    }
});
const customer = mongoose_1.default.model('customer', customerSchema);
exports.default = customer;
//# sourceMappingURL=customer.model.js.map