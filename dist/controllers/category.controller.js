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
exports.updateCategory = exports.deleteCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../database/models/category.model"));
const express_validator_1 = require("express-validator");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, description } = req.body;
        const category = new category_model_1.default({
            name,
            description
        });
        yield category.save();
        res.json({
            status: "success",
            data: category,
            message: "Category created successfully",
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating category',
        });
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find();
        res.json({
            status: "success",
            data: categories,
            message: "Categories fetched successfully",
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching categories',
        });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        }
        res.json({
            status: "success",
            data: category,
            message: "Category fetched successfully",
        });
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching category',
        });
    }
});
exports.getCategoryById = getCategoryById;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        }
        res.json({
            status: "success",
            data: category,
            message: "Category deleted successfully",
        });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting category',
        });
    }
});
exports.deleteCategory = deleteCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const category = yield category_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        }
        res.json({
            status: "success",
            data: category,
            message: "Category updated successfully",
        });
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error updating category',
        });
    }
});
exports.updateCategory = updateCategory;
//# sourceMappingURL=category.controller.js.map