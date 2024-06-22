import { Request, Response } from "express";
import Category, { ICategory } from "../database/models/category.model";
import { validationResult } from "express-validator";
import { LocaleKeys } from "index";
const categoryFields = (category: ICategory, locale?: LocaleKeys) => ({
    id: category._id,
    name: category.name[locale] || category.name,
    description: category.description[locale] || category.description,
    featured: category.featured,
    status: category.status,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
});
async function createCategory(req: Request, res: Response) {

    try {
        const category: ICategory = new Category(req.body);

        await category.save();
        res.json({
            status: "success",
            data: categoryFields(category),
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

const getCategories = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, featured, multiLocale } = req.query;
        const locale = req.query.locale as LocaleKeys || 'en';


        const categories = await Category
            .find(featured && { featured: featured === 'true' })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalCategories = await Category.countDocuments();

        res.json({
            status: "success",
            message: "Categories fetched successfully",
            categories: categories.map((category) => categoryFields(category, !multiLocale ? locale : null)),
            total: totalCategories,
            page: Number(page),
            pages: Math.ceil(totalCategories / Number(limit)),
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching categories',
        });
    }
};

const getCategoryById = async (req: Request, res: Response) => {
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
            category: categoryFields(category),
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

const deleteCategory = async (req: Request, res: Response) => {
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
            data: categoryFields(category),
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

const updateCategory = async (req: Request, res: Response) => {
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
            data: categoryFields(category),
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
export {
    createCategory,
    getCategories,
    getCategoryById,
    deleteCategory,
    updateCategory,
    categoryFields
};