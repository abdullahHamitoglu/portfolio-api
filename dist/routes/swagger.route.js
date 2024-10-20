"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const swagger_controller_1 = require("../controllers/swagger.controller");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
router.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_controller_1.specs));
exports.swaggerRoutes = router;
//# sourceMappingURL=swagger.route.js.map