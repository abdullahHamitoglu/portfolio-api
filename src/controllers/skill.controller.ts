import { Request, Response } from "express";
import Skill, { ISkill } from "../database/models/skills.model";
import { check } from "express-validator";
import multer from 'multer';
import path from 'path';

// Set base path for uploads based on environment
const basePath = path.join(__dirname, '../../public/uploads/');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});

// Initialize multer with the storage configuration
export const upload = multer({ storage });

export const createSkill = async (req: Request, res: Response) => {
    try {
        const skill: ISkill = new Skill(req.body);

        // Save image to storage
        if (req.files && 'image' in req.files) {
            const image = req.files['image'] as Express.Multer.File[];
            if (image.length > 0) {
                const imageFile = image[0];
                skill.image = `/uploads/${imageFile.filename}`;
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
};

export const getSkills = async (req: Request, res: Response) => {
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
};

export const getSkillById = async (req: Request, res: Response) => {
    const skill = await Skill.findById(req.params.id);
    res.json({
        status: "success",
        data: skill,
        message: "Skill fetched successfully",
    });
};

export const deleteSkill = async (req: Request, res: Response) => {
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
};

export const updateSkill = async (req: Request, res: Response) => {
    const skill: any = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
            image: skill.image ? `${req.protocol}://${req.get('host')}${skill.image}` : null,
        },
        message: "Skill updated successfully",
    });
};
