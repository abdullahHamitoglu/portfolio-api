"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageRoutes = void 0;
const express_1 = require("express");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const storage_controller_1 = require("../controllers/storage.controller");
const authToken_1 = require("../middleware/authToken");
const router = (0, express_1.Router)();
router.get('/', authToken_1.authenticateToken, storage_controller_1.gallery);
router.post('/', authToken_1.authenticateToken, uploadMiddleware_1.default, storage_controller_1.uploadImages);
router.delete('/:filename', authToken_1.authenticateToken, storage_controller_1.removeImages);
exports.StorageRoutes = router;
//# sourceMappingURL=storage.route.js.map