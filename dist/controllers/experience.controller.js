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
exports.updateExperience = exports.deleteExperience = exports.getExperienceById = exports.getExperiences = exports.createExperience = void 0;
const experience_model_1 = __importDefault(require("../database/models/experience.model"));
const express_validator_1 = require("express-validator");
const createExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, company, location, from, to, current, description } = req.body;
        const experience = new experience_model_1.default({
            title,
            company,
            location,
            from,
            to,
            current,
            description
        });
        yield experience.save();
        res.json({
            status: "success",
            data: experience,
            message: "Experience created successfully",
        });
    }
    catch (error) {
        console.error('Error creating experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating experience',
        });
    }
});
exports.createExperience = createExperience;
const getExperiences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experiences = yield experience_model_1.default.find();
        res.json({
            status: "success",
            data: experiences,
            message: "Experiences fetched successfully",
        });
    }
    catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching experiences',
        });
    }
});
exports.getExperiences = getExperiences;
const getExperienceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experience = yield experience_model_1.default.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({
                status: "error",
                message: "Experience not found",
            });
        }
        res.json({
            status: "success",
            data: experience,
            message: "Experience fetched successfully",
        });
    }
    catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching experience',
        });
    }
});
exports.getExperienceById = getExperienceById;
const deleteExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experience = yield experience_model_1.default.findByIdAndDelete(req.params.id);
        if (!experience) {
            return res.status(404).json({
                status: "error",
                message: "Experience not found",
            });
        }
        res.json({
            status: "success",
            data: experience,
            message: "Experience deleted successfully",
        });
    }
    catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting experience',
        });
    }
});
exports.deleteExperience = deleteExperience;
const updateExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const experience = yield experience_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!experience) {
            return res.status(404).json({
                status: "error",
                message: "Experience not found",
            });
        }
        res.json({
            status: "success",
            data: experience,
            message: "Experience updated successfully",
        });
    }
    catch (error) {
        console.error('Error updating experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error updating experience',
        });
    }
});
exports.updateExperience = updateExperience;
//# sourceMappingURL=experience.controller.js.map