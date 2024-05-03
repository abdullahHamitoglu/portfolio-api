"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
require("./database"); // initialize database
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*', // You can specify specific origins if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'); // Allow specified methods
    // Allow specific headers including 'Authorization'
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express_1.default.json());
app.use('/api', routes_1.MainRouter);
app.use(express_1.default.static(path_1.default.resolve('./public')));
app.use(express_1.default.static(path_1.default.resolve('./tmp')));
app.use('/', (req, res) => {
    res.sendFile(path_1.default.resolve('./public/index.html'));
});
const port = process.env.PORT || 3000;
// Start server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map