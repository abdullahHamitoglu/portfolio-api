import { Request, Response } from "express";
import Category, { ICategory } from "../database/models/category.model";
import { validationResult } from "express-validator";

export const createCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description } = req.body;
        const category: ICategory = new Category({
            name,
            description
        });

        await category.save();
        res.json({
            status: "success",
            data: category,
            message: "Category created successfully",
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating category',
        });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories: ICategory[] = await Category.find();
        res.json({
            status: "success",
            data: categories,
            message: "Categories fetched successfully",
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching categories',
        });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
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
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching category',
        });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
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
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting category',
        });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error updating category',
        });
    }
};

