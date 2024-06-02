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
exports.SkillsRouter = void 0;
const express_1 = require("express");
const Skills_1 = __importDefault(require("../database/models/Skills"));
const authToken_1 = require("../controllers/authToken");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handleValidationErrors_1 = require("../controllers/handleValidationErrors");
// Set base path for uploads based on environment
const basePath = path_1.default.join(__dirname, '../../public/uploads/skills/images');
// Ensure the directory exists
fs_1.default.mkdirSync(basePath, { recursive: true });
// Configure storage for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination directory for file uploads
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        // Specify the filename for the uploaded file
        const ext = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});
// Initialize multer with the storage configuration
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
// Create skill route
router.post('/', authToken_1.authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
], handleValidationErrors_1.HandleValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = new Skills_1.default(req.body);
        // save image to storage
        if (req.files && 'image' in req.files) {
            const image = req.files['image'];
            if (image.length > 0) {
                const imageFile = image[0]; // Assuming only one file per field
                skill.image = `/uploads/skills/images/${imageFile.filename}`;
            }
        }
        yield skill.save();
        res.json({
            status: "success",
            result: {
                id: skill._id,
                title: skill.title,
                image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
            },
            message: "Skill created successfully",
        });
    }
    catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating skill',
        });
    }
}));
// Get all skills
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield Skills_1.default.find();
    res.json({
        status: "success",
        data: skills.map(skill => ({
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        })),
        message: "Skills fetched successfully",
    });
}));
// Get skill by id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_1.default.findById(req.params.id);
    res.json({
        status: "success",
        data: skill,
        message: "Skill fetched successfully",
    });
}));
// Delete skill by id
router.delete("/:id", authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_1.default.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        },
        message: "Skill deleted successfully",
    });
}));
// Update skill by id
router.put("/:id", authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        },
    });
}));
exports.SkillsRouter = router;
//# sourceMappingURL=skills.js.map