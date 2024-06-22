import { Router } from "express";
import { check } from "express-validator";
import {
    createCategory,
    getCategories,
    getCategoryById,
    deleteCategory,
    updateCategory
} from "../controllers/category.controller";
import { HandleValidationErrors } from "../middleware/handleValidationErrors";
import { authenticateToken } from "../middleware/authToken";

const router = Router();

router.post(
    '/',
    authenticateToken,
    [check('name').notEmpty().withMessage('Name is required')],
    HandleValidationErrors,
    createCategory
);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.delete("/:id", authenticateToken, deleteCategory);
router.put(
    "/:id",
    authenticateToken,
    [check('name').notEmpty().withMessage('Name is required')],
    HandleValidationErrors,
    updateCategory
);

export const CategoryRoutes = router;