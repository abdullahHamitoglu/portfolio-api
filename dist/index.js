"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("./i18n");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
dotenv_1.default.config();
require("./database");
const swagger_controller_1 = __importDefault(require("./controllers/swagger.controller"));
const app = (0, express_1.default)();
const swaggerDocs = (0, swagger_jsdoc_1.default)(swagger_controller_1.default);
app.use('/swagger-ui', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs, { swaggerOptions: { url: '/swagger-ui-init.js' } }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(i18n_1.i18nextMiddleware);
app.use(i18n_1.setLanguage);
app.use('', routes_1.MainRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map