"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoUri = process.env.MONGODB_URI;
(0, mongoose_1.connect)(mongoUri)
    .then(() => {
    console.log('Connected to MongoDB');
    console.log(`Database Name: ${mongoose_1.connection.name}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=index.js.map