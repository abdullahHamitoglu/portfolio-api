import { Router } from "express";
import Project from "../database/models/Projects";
import { authenticateToken } from "../controllers/authToken";
import User from "../database/models/User";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { check } from "express-validator";
import { HandleValidationErrors } from "../controllers/handleValidationErrors";

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
                background: project.background ? `${req.protocol}://${req.get('host')}${project.background}` : null, // Return full image URL
                images: project.images ? project.images.map((image) => (`${req.protocol}://${req.get('host')}${image}`)) : [],
            })),
            message: 'Projects fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Route to create a new project
router.post('/',
    authenticateToken,
    upload.fields([{ name: 'images', maxCount: 10 }, { name: 'background', maxCount: 1 }]),
    [
        check('title').notEmpty().withMessage('Title is required'),
        check('images').notEmpty().withMessage('Images is required'),
        check('background').notEmpty().withMessage('Background is required'),
    ],
    HandleValidationErrors,
    async (req: any, res: any) => {
        try {

            // Create a new project instance using the request body data
            const project = new Project(req.body);
            // Handle image file upload

            if (req.files && 'images' in req.files) {
                const imageFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'];
                project.images = imageFiles.map(file => `/uploads/projects/images/${file.filename}`);
            }

            if (req.files && 'background' in req.files) {
                const backgroundFiles = req.files['background'] as Express.Multer.File[];
                if (backgroundFiles.length > 0) {
                    const backgroundFile = backgroundFiles[0]; // Assuming only one file per field
                    project.background = `/uploads/projects/images/${backgroundFile.filename}`;
                }
            }

            await project.save();
            res.json({
                status: 'success',
                result: {
                    id: project._id,
                    title: project.title,
                    description: project.description,
                    background: project.background ? `${req.protocol}://${req.get('host')}${project.background}` : '',
                    images: project.images ? project.images.map((image) => (`${req.protocol}://${req.get('host')}${image}`)) : '',
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
    }
);



router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);


        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
                data: null,
            });
        }

        // delete images from the filesystem
        if (project.images && project.images.length) {
            project.images.forEach((image) => {
                const fullPath = path.join(__dirname, '../../public', image); // Adjust the path as necessary
                fs.unlinkSync(fullPath);
            });
        }

        // delete background image from the filesystem
        if (project.background) {
            const backgroundPath = path.join(__dirname, '../../public', project.background); // Adjust the path as necessary
            fs.unlinkSync(backgroundPath);
        }

        // Delete the project
        await Project.deleteOne(req.body.id);
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
//remove image from files 
router.delete('/removeImage/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
            });
        }
        const imagePath = path.join(__dirname, '../../public', project.images[req.body.index]);
        fs.unlinkSync(imagePath);
        project.images.splice(req.body.index, 1);
        await project.save();
        res.json({
            status: 'success',
            data: null,
            message: 'Image removed successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing image' });
    }
});

// Update project route
router.put('/:id', authenticateToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'background', maxCount: 1 }]), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
            });
        }

        // Update fields from request body
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;

        // Handle uploaded images
        if (req.files && 'images' in req.files) {
            const imageFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'];
            project.images = imageFiles.map(file => `/uploads/projects/images/${file.filename}`);
        }

        // Handle background image
        if (req.files && 'background' in req.files) {
            const backgroundFiles = req.files['background'] as Express.Multer.File[];
            if (backgroundFiles.length > 0) {
                const backgroundFile = backgroundFiles[0]; // Assuming only one file per field
                project.background = `/uploads/projects/images/${backgroundFile.filename}`;
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
                background: `${req.protocol}://${req.get('host')}${project.background}`,
                images: project.images.map((image) => (`${req.protocol}://${req.get('host')}${image}`)),
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
                background: project.background ? `${req.protocol}://${req.get('host')}${project.background}` : null,
                images: project.images ? project.images.map((image) => (`${req.protocol}://${req.get('host')}${image}`)) : [],
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
