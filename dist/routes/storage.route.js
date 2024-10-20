"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageRoutes = void 0;
const express_1 = require("express");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const storage_controller_1 = require("../controllers/storage.controller");
const authToken_1 = require("../middleware/authToken");
const blob_1 = require("@vercel/blob");
const router = (0, express_1.Router)();
router.get('/', authToken_1.authenticateToken, storage_controller_1.gallery);
router.post('/', authToken_1.authenticateToken, uploadMiddleware_1.default, storage_controller_1.uploadImages);
router.delete('/:filename', authToken_1.authenticateToken, storage_controller_1.removeImages);
router.get('/vercel-blob', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, blob_1.list)();
    res.json({
        status: 'success',
        data: response,
        message: 'Vercel Blob Storage API',
    });
}));
router.post('/vercel-blob', uploadMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'No files uploaded',
        });
    }
    const response = yield (0, blob_1.put)('my-bucket', files[0].buffer, {
        contentType: req.body.contentType,
        access: "public"
    });
    res.json({
        status: 'success',
        data: response,
        message: 'Vercel Blob Storage API',
    });
}));
exports.StorageRoutes = router;
//# sourceMappingURL=storage.route.js.map