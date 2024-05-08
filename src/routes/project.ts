import { Router } from "express";
import Project from "../database/models/Projects";
import { authenticateToken } from "../controllers/authToken";
import User from "../database/models/User";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Set base path for uploads based on environment
const basePath = path.join(__dirname, '../../public/uploads/projects/images');

// Ensure the directory exists
fs.mkdirSync(basePath, { recursive: true });

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

// Route to fetch all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json({
            status: 'success',
            data: projects.map((project) => ({
                id: project._id,
                title: project.title,
                description: project.description,
                background: `${req.protocol}://${req.get('host')}${project.background.replace('/public', '')}`, // Return full image URL
                images: project.images.map((image) => (`${req.protocol}://${req.get('host')}${image.replace('/public', '')}`)),
            })),
            message: 'Projects fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Route to create a new project
router.post('/', authenticateToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'background', maxCount: 1 }]), async (req, res) => {
    try {
        // Create a new project instance using the request body data
        const project = new Project(req.body);
        // Handle image file upload

        if (req.files && 'images' in req.files) {
            const imageFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'];
            project.images = imageFiles.map(file => `/public/uploads/projects/images/${file.filename}`);
        }

        if (req.files && 'background' in req.files) {
            const backgroundFiles = req.files['background'] as Express.Multer.File[];
            if (backgroundFiles.length > 0) {
                const backgroundFile = backgroundFiles[0]; // Assuming only one file per field
                project.background = `/public/uploads/projects/images/${backgroundFile.filename}`;
            }
        }

        await project.save();
        res.json({
            status: 'success',
            result: {
                id: project._id,
                title: project.title,
                description: project.description,
                background: `${req.protocol}://${req.get('host')}${project.background.replace('/public', '')}`,
                images: project.images.map((image) => (`${req.protocol}://${req.get('host')}${image.replace('/public', '')}`)),
            },
            message: 'Project created successfully',
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating project',
        });
    }
});



router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        // delete images from the filesystem
        project.images.forEach((image) => {
            const fullPath = path.join(__dirname, '../../', image); // Adjust the path as necessary
            fs.unlinkSync(fullPath);
        });
        // delete background image from the filesystem
        if (project.background) {
            const backgroundPath = path.join(__dirname, '../../', project.background); // Adjust the path as necessary
            fs.unlinkSync(backgroundPath);
        }
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
});

// Update project route
router.put('/:id', authenticateToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'background', maxCount: 1 }]), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
            });
        }
        // remove old images from the filesystem
        project.images.forEach((image) => {
            const fullPath = path.join(__dirname, '../../', image); // Adjust the path as necessary
            fs.unlinkSync(fullPath);
        });

        // Handle uploaded image
        if (req.files && 'images' in req.files) {
            const imageFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'];
            project.images = imageFiles.map(file => `/public/uploads/projects/images/${file.filename}`);
        }
        if (req.files && 'background' in req.files) {
            const backgroundFiles = req.files['background'] as Express.Multer.File[];
            if (backgroundFiles.length > 0) {
                const backgroundFile = backgroundFiles[0]; // Assuming only one file per field
                project.background = `/public/uploads/projects/images/${backgroundFile.filename}`;
            }
        }
        // Save the updated project
        await project.save();
        res.json({
            status: 'success',
            data: {
                id: project._id,
                title: project.title,
                description: project.description,
                background: `${req.protocol}://${req.get('host')}${project.background.replace('public', '')}`,
                images: project.images.map((image) => (`${req.protocol}://${req.get('host')}${image.replace('/public', '')}`)),
            },
            message: 'Project updated successfully',
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Error updating project' });
    }
});


router.get('/:id', async (req, res) => {
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
            data: {
                id: project._id,
                title: project.title,
                description: project.description,
                background: `${req.protocol}://${req.get('host')}${project.background.replace('/public', '')}`,
                images: project.images.map((image) => (`${req.protocol}://${req.get('host')}${image.replace('/public', '')}`)),
            },
            message: 'Project fetched successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching project' });
    }
});
// delete all projects 
router.delete('/', authenticateToken, async (req, res) => {
    // delete all projects images
    fs.readdirSync(basePath).forEach((file) => {
        fs.unlinkSync(path.join(basePath, file));
    });
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
});
router.get('/search/:query', authenticateToken, async (req, res) => {
    try {
        const query = req.params.query;
        const projects = await Project.find({ $text: { $search: query } });
        res.json({
            status: 'success',
            data: {
                projects: projects.map((project) => ({
                    id: project._id,
                    title: project.title,
                    description: project.description,
                    background: `${req.protocol}://${req.get('host')}${project.background.replace('/public', '')}`,
                    images: project.images.map((image) => (`${req.protocol}://${req.get('host')}${image.replace('/public', '')}`)),
                })),
            },
            message: 'Projects fetched successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

export const ProjectRoutes = router;
