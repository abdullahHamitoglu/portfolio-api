import { Router } from "express";
import Project from "../database/models/Projects";
import { authenticateToken } from "../controllers/authToken";
import User from "../database/models/User";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage options for multer

// Create an instance of multer with the storage configuration

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination directory for file uploads
        cb(null, 'public/uploads/projects/images');
        // Create the directory if it doesn't exist
        if (!fs.existsSync('public/uploads/projects/images')) {
            fs.mkdirSync('public/uploads/projects/images', { recursive: true });
        }
    },
    filename: (req, file, cb) => {
        // Specify the filename for the uploaded file
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({ storage });
const router = Router();
router.get('/', async (req: any, res) => {
    try {
        const projects = await Project.find();
        res.json({
            status: 'success',
            data: projects.map((project) => ({
                id: project._id,
                title: project.title,
                description: project.description,
                // return full image url host and port and path 
                image: `${req.protocol}://${req.get('host')}${project.image}`,
            })),
            message: 'Projects fetched successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
});
// Route to create a new project
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        // Create a new project instance using the request body data
        const project: any = new Project(req.body);

        // Check if an image file is uploaded
        if (req.file) {
            // Construct the image path based on the uploaded file's information
            project.image = `/uploads/projects/images/${req.file.filename}`;
        } else {
            // Handle the case where no image file was uploaded (optional)
            project.image = null; // or set a default image URL if desired
        }

        // Save the project to the database
        await project.save();

        // Respond with the created project data and a success message
        res.json({
            status: 'success',
            result: {
                id: project._id,
                title: project.title,
                description: project.description,
                image: `${req.protocol}://${req.get('host')}${project.image}`, // Return the image URL
            },
            message: 'Project created successfully',
        });
    } catch (error) {
        // Log the error and respond with an error message
        console.error(error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating project',
        });
    }
});



router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
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

// Route to update a project
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
                data: null,
            });
        }

        // Check if an image file is uploaded and update the project
        if (req.file) {
            try {
                // Delete the old image file
                const oldImagePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'projects', 'images', path.basename(project.image));
                fs.unlinkSync(oldImagePath);
            } catch (err: any) {
                if (err.code !== 'ENOENT') {
                    // If the error is not "file not found", log the error and continue
                    console.error('Error deleting old image file:', err);
                }
            }

            // Save the new image file
            project.image = `/uploads/projects/images/${req.file.filename}`;
        }

        // Save the updated project
        await project.save();

        res.json({
            status: 'success',
            data: {
                id: project._id,
                title: project.title,
                description: project.description,
                image: `${req.protocol}://${req.get('host')}${project.image}`, // Return the image URL
            },
            message: 'Project updated successfully',
        });
    } catch (error) {
        console.error(error);
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
                image: `${req.protocol}://${req.get('host')}${project.image}`,
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
    try {
        await Project.deleteMany({});
        res.json({
            status: 'success',
            data: null,
            message: 'All projects deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting projects' });
    }
});
router.get('/search/:query', authenticateToken, async (req, res) => {
    try {
        const query = req.params.query;
        const projects = await Project.find({ $text: { $search: query } });
        res.json({
            status: 'success',
            data: projects,
            message: 'Projects fetched successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

export const ProjectRoutes = router;