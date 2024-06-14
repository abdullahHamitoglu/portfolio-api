import { Router } from "express";
import { check } from "express-validator";
import {
    createExperience,
    getExperiences,
    getExperienceById,
    deleteExperience,
    updateExperience
} from "../controllers/experience.controller";
import { HandleValidationErrors } from "../middleware/handleValidationErrors";
import { authenticateToken } from "../middleware/authToken";

const router = Router();

router.post(
    '/',
    authenticateToken,
    [
        check('title').notEmpty().withMessage('Title is required'),
        check('company').notEmpty().withMessage('Company is required'),
        check('location').notEmpty().withMessage('Location is required'),
        check('from').notEmpty().withMessage('From date is required'),
        check('description').notEmpty().withMessage('Description is required')
    ],
    HandleValidationErrors,
    createExperience
);

router.get("/", getExperiences);
router.get("/:id", getExperienceById);
router.delete("/:id", authenticateToken, deleteExperience);
router.put(
    "/:id",
    authenticateToken,
    [
        check('title').notEmpty().withMessage('Title is required'),
        check('company').notEmpty().withMessage('Company is required'),
        check('location').notEmpty().withMessage('Location is required'),
        check('from').notEmpty().withMessage('From date is required'),
        check('description').notEmpty().withMessage('Description is required')
    ],
    HandleValidationErrors,
    updateExperience
);

export const ExperienceRoute = router
