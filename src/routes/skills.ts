import { Response, Router, Request } from "express";
import Skill, { ISkill } from "../database/models/Skills";
import { authenticateToken } from "../controllers/authToken";
import { check, validationResult } from "express-validator";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { HandleValidationErrors } from "../controllers/handleValidationErrors";

// Set base path for uploads based on environment
const basePath = path.join(__dirname, '../../public/uploads/skills/images');

// Ensure the directory exists

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination directory for file uploads
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        // Specify the filename for the uploaded file
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

const router = Router();


// Create skill route
router.post(
    '/',
    authenticateToken,
    upload.fields([{ name: 'image', maxCount: 1 }]),
    [
        check('title').notEmpty().withMessage('Title is required'),
    ],
    HandleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const skill: ISkill = new Skill(req.body);

            // save image to storage
            if (req.files && 'image' in req.files) {
                const image = req.files['image'] as Express.Multer.File[];
                if (image.length > 0) {
                    const imageFile = image[0]; // Assuming only one file per field
                    skill.image = `/uploads/skills/images/${imageFile.filename}`;
                }
            }

            await skill.save();
            res.json({
                status: "success",
                result: {
                    id: skill._id,
                    title: skill.title,
                    image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
                },
                message: "Skill created successfully",
            });
        } catch (error) {
            console.error('Error creating skill:', error);
            res.status(500).json({
                status: 'error',
                error: 'Error creating skill',
            });
        }
    }
);

// Get all skills
router.get("/", async (req, res) => {
    const skills: ISkill[] = await Skill.find();
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

// Get skill by id
router.get("/:id", async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    res.json({
        status: "success",
        data: skill,
        message: "Skill fetched successfully",
    });
});

// Delete skill by id
router.delete("/:id", authenticateToken, async (req, res) => {
    const skill: any = await Skill.findByIdAndDelete(req.params.id);

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

// Update skill by id
router.put("/:id", authenticateToken, async (req, res) => {
    const skill: any = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        },
    });
});

export const SkillsRouter = router;
