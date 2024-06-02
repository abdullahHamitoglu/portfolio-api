"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const Projects_1 = __importDefault(require("../database/models/Projects"));
const authToken_1 = require("../controllers/authToken");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const handleValidationErrors_1 = require("../controllers/handleValidationErrors");
dotenv_1.default.config();
// Set base path for uploads based on environment
const basePath = path_1.default.join(__dirname, '../../public/uploads/projects/images');
// Ensure the directory exists
fs_1.default.mkdirSync(basePath, { recursive: true });
// Configure storage for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination directory for file uploads
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        // Specify the filename for the uploaded file
        const ext = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});
// Initialize multer with the storage configuration
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
// Route to fetch all projects
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Projects_1.default.find();
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
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
}));
// Route to create a new project
router.post('/', authToken_1.authenticateToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'background', maxCount: 1 }]), [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.check)('images').notEmpty().withMessage('Images is required'),
    (0, express_validator_1.check)('background').notEmpty().withMessage('Background is required'),
], handleValidationErrors_1.HandleValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new project instance using the request body data
        const project = new Projects_1.default(req.body);
        // Handle image file upload
        if (req.files && 'images' in req.files) {
            const imageFiles = req.files['images'];
            project.images = imageFiles.map(file => `/uploads/projects/images/${file.filename}`);
        }
        if (req.files && 'background' in req.files) {
            const backgroundFiles = req.files['background'];
            if (backgroundFiles.length > 0) {
                const backgroundFile = backgroundFiles[0]; // Assuming only one file per field
                project.background = `/uploads/projects/images/${backgroundFile.filename}`;
            }
        }
        yield project.save();
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
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating project',
        });
    }
}));
router.delete('/:id', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Projects_1.default.findById(req.params.id);
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
                const fullPath = path_1.default.join(__dirname, '../../public', image); // Adjust the path as necessary
                fs_1.default.unlinkSync(fullPath);
            });
        }
        // delete background image from the filesystem
        if (project.background) {
            const backgroundPath = path_1.default.join(__dirname, '../../public', project.background); // Adjust the path as necessary
            fs_1.default.unlinkSync(backgroundPath);
        }
        // Delete the project
        yield Projects_1.default.deleteOne(req.body.id);
        res.json({
            status: 'success',
            data: null,
            message: 'Project deleted successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting project' });
    }
}));
//remove image from files 
router.delete('/removeImage/:id', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Projects_1.default.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found',
            });
        }
        const imagePath = path_1.default.join(__dirname, '../../public', project.images[req.body.index]);
        fs_1.default.unlinkSync(imagePath);
        project.images.splice(req.body.index, 1);
        yield project.save();
        res.json({
            status: 'success',
            data: null,
            message: 'Image removed successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing image' });
    }
}));
// Update project route
router.put('/:id', authToken_1.authenticateToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'background', maxCount: 1 }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Projects_1.default.findById(req.params.id);
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
            const imageFiles = req.files['images'];
            project.images = imageFiles.map(file => `/uploads/projects/images/${file.filename}`);
        }
        // Handle background image
        if (req.files && 'background' in req.files) {
            const backgroundFiles = req.files['background'];
            if (backgroundFiles.length > 0) {
                const backgroundFile = backgroundFiles[0]; // Assuming only one file per field
                project.background = `/uploads/projects/images/${backgroundFile.filename}`;
            }
        }
        // Save the updated project
        yield project.save();
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
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Error updating project' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Projects_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching project' });
    }
}));
// delete all projects 
router.delete('/', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // delete all projects images
    fs_1.default.readdirSync(basePath).forEach((file) => {
        fs_1.default.unlinkSync(path_1.default.join(basePath, file));
    });
    const projects = yield Projects_1.default.find();
    if (projects.length <= 0) {
        return res.status(401).json({
            status: 'error',
            error: 'No projects to delete',
            message: 'No projects to delete',
        });
    }
    try {
        yield Projects_1.default.deleteMany({});
        res.json({
            status: 'success',
            data: null,
            message: 'All projects deleted successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting projects',
            message: 'Error deleting projects',
        });
    }
}));
router.get('/search/:query', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.query;
        const projects = yield Projects_1.default.find({ $text: { $search: query } });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
}));
exports.ProjectRoutes = router;
//# sourceMappingURL=project.js.map