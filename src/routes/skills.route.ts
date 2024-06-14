import { Router } from "express";
import { check } from "express-validator";
import { authenticateToken } from "../middleware/authToken";
import {
    createSkill,
    getSkills,
    getSkillById,
    deleteSkill,
    updateSkill,
    upload
} from "../controllers/skill.controller";
import { HandleValidationErrors } from "../middleware/handleValidationErrors";

const router = Router();

router.post(
    '/',
    authenticateToken,
    upload.fields([{ name: 'image', maxCount: 1 }]),
    [
        check('title').notEmpty().withMessage('Title is required'),
    ],
    HandleValidationErrors,
    createSkill
);

router.get("/", getSkills);
router.get("/:id", getSkillById);
router.delete("/:id", authenticateToken, deleteSkill);
router.put("/:id", authenticateToken, updateSkill);

export const SkillsRouter = router;
