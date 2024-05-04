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
const router = (0, express_1.Router)();
// create skill 
router.post("/", authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        if (!req.body.title) {
            res.status(401).json({
                status: 'error',
                message: 'title is required',
                data: null,
            });
        }
        const skill = new Skills_1.default(req.body);
        yield skill.save();
        res.json({
            status: "success",
            result: {
                id: skill._id,
                title: skill.title,
            },
            message: "Skill created successfully",
        });
    }
    catch (error) {
        console.log(error);
    }
}));
// get all skills
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield Skills_1.default.find();
    res.json({
        status: "success",
        data: skills.map(skill => ({
            id: skill._id,
            title: skill.title,
        })),
        message: "Skills fetched successfully",
    });
}));
// get skill by id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_1.default.findById(req.params.id);
    res.json({
        status: "success",
        data: skill,
    });
}));
// delete skill by id
router.delete("/:id", authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_1.default.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
        },
        message: "Skill deleted successfully",
    });
}));
// update skill by id
router.put("/:id", authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skills_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
        },
    });
}));
exports.SkillsRouter = router;
//# sourceMappingURL=skills.js.map