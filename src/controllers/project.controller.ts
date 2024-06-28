import Project, { IProject } from "../database/models/Projects.model";
import { Request, Response } from "express";
import { LocaleKeys } from "index";
import { categoryFields } from "./category.controller";
import { ICategory } from "../database/models/category.model";

const projectFields = (project: IProject, locale?: LocaleKeys) => ({
    id: project._id,
    title: project.title[locale] || project.title,
    description: project.description[locale] || project.description,
    background: project.background,
    images: project.images,
    featured: project.featured,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    category: categoryFields(project.category as ICategory , locale),
});

async function getAllProjects(req: Request, res: Response) {
    try {
        const { page = 1, limit = 10, featured, multiLocale } = req.query;
        const locale = req.query.locale as LocaleKeys || 'en';

        const query: any = {};
        if (featured) {
            query.featured = featured === 'true';
        }
        if (req.query.category) {
            query.category = req.query.category;
        }

        const projects = await Project.find(query)
            .populate('category') // Populate the category field
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalProjects = await Project.countDocuments(query);

        res.json({
            status: 'success',
            message: req.t('projects_fetched_successfully'),
            projects: projects.map(project => multiLocale ? projectFields(project) : projectFields(project, locale)),
            total: totalProjects,
            page: Number(page),
            pages: Math.ceil(totalProjects / Number(limit)),
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: req.t('error_fetching_projects') });
    }
}

async function getProjectById(req: Request, res: Response) {
    try {
        const locale = req.query.locale as LocaleKeys || 'en';
        const multiLocale = req.query.multiLocale;

        const project = await Project.findById(req.params.id).populate('category');
        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: req.t('project_not_found'),
                data: null,
            });
        }
        res.json({
            status: 'success',
            project: projectFields(project, multiLocale ? null : locale),
            message: req.t('project_fetched_successfully'),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: req.t('error_fetching_project') });
    }
}

async function createProject(req: Request, res: Response) {
    try {
        const locale = req.query.locale as LocaleKeys || 'en';
        const project = await Project.create(req.body);
        res.json({
            status: 'success',
            project: projectFields(project, locale),
            message: req.t('project_created_successfully'),
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            status: 'error',
            message: req.t('error_creating_project'),
            error: error.message,
        });
    }
}

async function updateProject(req: Request, res: Response) {
    try {
        const locale = req.query.locale as LocaleKeys || 'en';
        let project = await Project.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: req.t('project_not_found'),
            });
        }

        if (req.body.images) {
            // Add new images to the existing ones
            project.images = [...project.images, ...req.body.images];
            await project.save();
        }

        res.json({
            status: 'success',
            data: projectFields(project, locale),
            message: req.t('project_updated_successfully'),
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: req.t('error_updating_project') });
    }
}

async function deleteProject(req: Request, res: Response) {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: req.t('project_not_found'),
                data: null,
            });
        }

        res.json({
            status: 'success',
            data: null,
            message: req.t('project_deleted_successfully'),
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: req.t('error_deleting_project') });
    }
}

async function deleteAllProjects(req: Request, res: Response) {
    try {
        const projects = await Project.find();
        if (projects.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: req.t('no_projects_to_delete'),
                data: null,
            });
        }

        await Project.deleteMany({});
        res.json({
            status: 'success',
            data: null,
            message: req.t('projects_deleted_successfully'),
        });
    } catch (error) {
        console.error('Error deleting all projects:', error);
        res.status(500).json({
            status: 'error',
            message: req.t('error_deleting_projects'),
            error: error.message,
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
    projectFields
};
