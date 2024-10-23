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
exports.removeVercelBlob = exports.getVercelBlob = exports.uploadVercelBlob = exports.gallery = exports.removeImages = exports.uploadImages = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const blob_1 = require("@vercel/blob");
const blob_2 = require("@vercel/blob");
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    files.forEach((file) => {
        const filePath = `public/uploads/${file.filename}`;
        fs_1.default.rename(file.path, filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to store the file' });
            }
        });
    });
    const uploadedFiles = files.map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    res.status(200).json({
        message: 'File upload successful',
        files: uploadedFiles,
        status: 200,
    });
});
exports.uploadImages = uploadImages;
const removeImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, '../../public/uploads', filename);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to delete file' });
            }
            res.json({ message: 'File deleted successfully' });
        });
    });
});
exports.removeImages = removeImages;
const gallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadsDir = path_1.default.join(__dirname, '../../public/uploads');
    fs_1.default.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        const images = files.filter(file => {
            return `${/\.(jpg|jpeg|png|gif|webp|svg)$/.test(file)}`;
        });
        res.json(images.map((image) => (`${req.protocol}://${req.get('host')}/uploads/${image}`)));
    });
});
exports.gallery = gallery;
const uploadVercelBlob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.uploadVercelBlob = uploadVercelBlob;
const getVercelBlob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.getVercelBlob = getVercelBlob;
const removeVercelBlob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req.body;
        if (!file) {
            return res.status(400).json({
                status: 'error',
                message: 'Filename is required',
            });
        }
        yield (0, blob_2.del)(file.url);
        res.json({
            status: 'success',
            message: 'File deleted successfully from Vercel Blob Storage',
        });
    }
    catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({
            status: 'error',
            message: 'File deletion failed',
        });
    }
});
exports.removeVercelBlob = removeVercelBlob;
//# sourceMappingURL=storage.controller.js.map