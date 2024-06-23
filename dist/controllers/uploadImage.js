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
exports.removeImages = exports.uploadImages = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
const removeImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const dir = path_1.default.join(__dirname, '../../public/uploads');
    if (!files)
        return next();
    for (const file of files) {
        fs_1.default.unlink(`${dir}/${file.filename}`, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    next();
});
exports.removeImages = removeImages;
//# sourceMappingURL=uploadImage.js.map