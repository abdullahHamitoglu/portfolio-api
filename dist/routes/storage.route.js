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
const multer_1 = __importDefault(require("multer"));
const storage_controller_1 = require("../controllers/storage.controller");
const authToken_1 = require("../middleware/authToken");
const blob_1 = require("@vercel/blob");
const router = (0, express_1.Router)();
const uploadMiddleware = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).single('file');
router.get('/', authToken_1.authenticateToken, storage_controller_1.gallery);
router.post('/', authToken_1.authenticateToken, uploadMiddleware, storage_controller_1.uploadImages);
router.delete('/:filename', authToken_1.authenticateToken, storage_controller_1.removeImages);
router.get('/vercel-blob', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, blob_1.list)();
        res.json({
            status: 'success',
            data: response,
            message: 'Vercel Blob Storage API',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving files from Vercel Blob',
        });
    }
}));
router.post('/vercel-blob', uploadMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                status: 'error',
                message: 'No files uploaded',
            });
        }
        const response = yield (0, blob_1.put)(file.originalname, file.buffer, {
            access: "public",
        });
        res.json({
            status: 'success',
            data: response,
            message: 'File uploaded successfully to Vercel Blob Storage',
        });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({
            status: 'error',
            message: 'File upload failed',
        });
    }
}));
exports.StorageRoutes = router;
//# sourceMappingURL=storage.route.js.map