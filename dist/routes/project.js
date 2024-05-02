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
dotenv_1.default.config();
// Configure storage for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (process.env.PROD) {
            // Specify the destination directory for file uploads
            cb(null, process.cwd() + '/public/uploads/projects/images');
            // Create the directory if it doesn't exist
            if (!fs_1.default.existsSync(process.cwd() + '/public/uploads/projects/images')) {
                fs_1.default.mkdirSync(process.cwd() + '/public/uploads/projects/images', { recursive: true });
            }
        }
        else {
            // Specify the destination directory for file uploads
            cb(null, process.cwd() + '/uploads/projects/images');
            // Create the directory if it doesn't exist
            if (!fs_1.default.existsSync(process.cwd() + '/uploads/projects/images')) {
                fs_1.default.mkdirSync(process.cwd() + '/uploads/projects/images', { recursive: true });
            }
        }
    },
    filename: (req, file, cb) => {
        // Specify the filename for the uploaded file
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Projects_1.default.find();
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
}));
// Route to create a new project
router.post('/', authToken_1.authenticateToken, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new project instance using the request body data
        const project = new Projects_1.default(req.body);
        // Check if an image file is uploaded
        if (req.file) {
            // Construct the image path based on the uploaded file's information
            project.image = `/uploads/projects/images/${req.file.filename}`;
        }
        else {
            // Handle the case where no image file was uploaded (optional)
            project.image = null; // or set a default image URL if desired
        }
        // Save the project to the database
        yield project.save();
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
    }
    catch (error) {
        // Log the error and respond with an error message
        console.error(error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating project',
        });
    }
}));
router.delete('/:id', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Projects_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting project' });
    }
}));
// Route to update a project
router.put('/:id', authToken_1.authenticateToken, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Projects_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
                const oldImagePath = path_1.default.join(__dirname, '..', '..', 'public', 'uploads', 'projects', 'images', path_1.default.basename(project.image));
                fs_1.default.unlinkSync(oldImagePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // If the error is not "file not found", log the error and continue
                    console.error('Error deleting old image file:', err);
                }
            }
            // Save the new image file
            project.image = `/uploads/projects/images/${req.file.filename}`;
        }
        // Save the updated project
        yield project.save();
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
    }
    catch (error) {
        console.error(error);
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
                image: `${req.protocol}://${req.get('host')}${project.image}`,
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
        res.status(500).json({ error: 'Error deleting projects' });
    }
}));
router.get('/search/:query', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.query;
        const projects = yield Projects_1.default.find({ $text: { $search: query } });
        res.json({
            status: 'success',
            data: projects,
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