import { Request, Response } from "express";
import Experience, { IExperience } from "../database/models/experience.model";
import { check, validationResult } from "express-validator";

export const createExperience = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, company, location, from, to, current, description } = req.body;
        const experience: IExperience = new Experience({
            title,
            company,
            location,
            from,
            to,
            current,
            description
        });

        await experience.save();
        res.json({
            status: "success",
            data: experience,
            message: "Experience created successfully",
        });
    } catch (error) {
        console.error('Error creating experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating experience',
        });
    }
};

export const getExperiences = async (req: Request, res: Response) => {
    try {
        const experiences: IExperience[] = await Experience.find();
        res.json({
            status: "success",
            data: experiences,
            message: "Experiences fetched successfully",
        });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching experiences',
        });
    }
};

export const getExperienceById = async (req: Request, res: Response) => {
    try {
        const experience = await Experience.findById(req.params.id);
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
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching experience',
        });
    }
};

export const deleteExperience = async (req: Request, res: Response) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);
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
    } catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting experience',
        });
    }
};

export const updateExperience = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    } catch (error) {
        console.error('Error updating experience:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error updating experience',
        });
    }
};
