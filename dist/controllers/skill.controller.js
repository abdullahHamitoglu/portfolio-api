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
exports.updateSkill = exports.deleteSkill = exports.getSkillById = exports.getSkills = exports.createSkill = exports.upload = void 0;
const Skills_model_1 = __importDefault(require("../database/models/Skills.model"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const basePath = path_1.default.join(__dirname, '../../public/uploads/');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});
exports.upload = (0, multer_1.default)({ storage });
const createSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = new Skills_model_1.default(req.body);
        if (req.files && 'image' in req.files) {
            const image = req.files['image'];
            if (image.length > 0) {
                const imageFile = image[0];
                skill.image = `/uploads/${imageFile.filename}`;
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
});
exports.createSkill = createSkill;
const getSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield Skills_model_1.default.find();
    res.json({
        status: "success",
        data: skills.map(skill => ({
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        })),
        message: "Skills fetched successfully",
    });
});
exports.getSkills = getSkills;
const getSkillById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_model_1.default.findById(req.params.id);
    res.json({
        status: "success",
        data: skill,
        message: "Skill fetched successfully",
    });
});
exports.getSkillById = getSkillById;
const deleteSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_model_1.default.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        },
        message: "Skill deleted successfully",
    });
});
exports.deleteSkill = deleteSkill;
const updateSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        },
        message: "Skill updated successfully",
    });
});
exports.updateSkill = updateSkill;
//# sourceMappingURL=skill.controller.js.map