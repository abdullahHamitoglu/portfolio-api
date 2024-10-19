"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PageSchema = new mongoose_1.Schema({
    slug: { type: String, required: true },
    title: {
        ar: { type: String, required: [true, "Please provide title in English"], },
        en: { type: String, },
        tr: { type: String, }
    },
    content: {
        ar: { type: String, required: [true, "Please provide content in English"], },
        en: { type: String, },
        tr: { type: String, }
    },
    status: { type: String, default: [true, "Please provide status in English"] },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Pages = mongoose_1.default.model('Pages', PageSchema);
exports.default = Pages;
//# sourceMappingURL=pages.model.js.map