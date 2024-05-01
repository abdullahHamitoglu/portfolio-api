"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.DB_URI;
// Connect to MongoDB
(0, mongoose_1.connect)(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));
//# sourceMappingURL=index.js.map