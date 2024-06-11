"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const uploadMiddleware = (req, res, next) => {
    upload.array('files', 5)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        const files = req.files;
        const errors = [];
        files.forEach((file) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/svg'];
            const maxSize = 5 * 1024 * 1024;
            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }
            if (file.size > maxSize) {
                errors.push(`File too large: ${file.originalname}`);
            }
        });
        if (errors.length > 0) {
            files.forEach((file) => {
                fs_1.default.unlinkSync(file.path);
            });
            return res.status(400).json({ errors });
        }
        req.files = files;
        next();
    });
};
exports.default = uploadMiddleware;
//# sourceMappingURL=uploadMiddleware.js.map