"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./database"); // initialize database
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    // Allow specific headers including 'Authorization'
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express_1.default.json());
app.use('/api', routes_1.MainRouter);
app.use(express_1.default.static(path_1.default.resolve('./public')));
app.use('/', (req, res) => {
    res.sendFile(path_1.default.resolve('./public/index.html'));
});
const port = process.env.PORT || 3000;
// Start server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map