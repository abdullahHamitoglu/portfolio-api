import Project, { IProject } from "../database/models/Projects.model";
import dotenv from 'dotenv';
import { Request, Response } from "express";
import Category from "../database/models/category.model";

dotenv.config();

const projectFields = (project: IProject) => ({
    id: project._id,
    title: project.title,
    description: project.description,
    background: project.background,
    images: project.images,
    featured: project.featured,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    category: project.category,
});

async function getAllProjects(req: Request, res: Response) {
    try {
        const { page = 1, limit = 10 } = req.query;

        const projects = await Project.find({
            status: req.query.status || 'active', // Only fetch published projects
            featured: req.query.featured, // Only fetch non-featured projects
        })
            .populate('category') // Populate the category field
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalProjects = await Project.countDocuments();

        res.json({
            status: 'success',
            message: 'Projects fetched successfully',
            projects: projects.map(project => projectFields(project)),
            total: totalProjects,
            page: Number(page),
            pages: Math.ceil(totalProjects / Number(limit)),
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
}

async function searchProjects(req: Request, res: Response) {
    try {
        const { query } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const projects = await Project.find({ $text: { $search: query } })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalProjects = await Project.countDocuments({ $text: { $search: query } });

        res.json({
            status: 'success',
            projects: projects.map(project => projectFields(project)),
            message: 'Projects fetched successfully',
            total: totalProjects,
            page: Number(page),
            pages: Math.ceil(totalProjects / Number(limit)),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
}

// The rest of the functions remain unchanged
async function getProjectById(req: Request, res: Response) {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
                data: null,
            });
        }
        res.json({
            status: 'success',
            project: projectFields(project),
            message: 'Project fetched successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching project' });
    }
}

async function createProject(req: Request, res: Response) {
    try {
        const project = await Project.create(req.body);
        res.json({
            status: 'success',
            project: projectFields(project),
            message: 'Project created successfully',
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating project',
            error: 'Error creating project',
        });
    }
}

async function updateProject(req: Request, res: Response) {
    try {
        let project = await Project.findOneAndUpdate({ _id: req.body.id }, req.body, {
            new: true,
            runValidators: true,
        });

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
            });
        }

        if (req.body.images) {
            // Add new images to the existing ones
            project.images = [...project.images, ...req.body.images];
            await project.save();
        }

        res.json({
            status: 'success',
            data: projectFields(project),
            message: 'Project updated successfully',
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Error updating project' });
    }
}

async function deleteProject(req: Request, res: Response) {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
                data: null,
            });
        }

        res.json({
            status: 'success',
            data: null,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting project' });
    }
}

async function deleteAllProjects(req: Request, res: Response) {
    const projects = await Project.find();
    if (projects.length <= 0) {
        return res.status(401).json({
            status: 'error',
            error: 'No projects to delete',
            message: 'No projects to delete',
        });
    }
    try {
        await Project.deleteMany({});
        res.json({
            status: 'success',
            data: null,
            message: 'All projects deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting projects',
            message: 'Error deleting projects',
        });
    }
}

export {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    searchProjects,
};