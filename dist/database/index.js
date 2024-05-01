"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoUri = process.env.MONGODB_URI;
// Connect to MongoDB
(0, mongoose_1.connect)(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));
//# sourceMappingURL=index.js.map