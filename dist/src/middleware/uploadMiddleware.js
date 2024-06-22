"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dir = process.env.PROD === 'true'
    ? path_1.default.resolve(__dirname, process.cwd(), 'public/uploads')
    : path_1.default.resolve(__dirname, '../../public/uploads');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
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
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
        const maxSize = 5 * 1024 * 1024;
        files.forEach((file) => {
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