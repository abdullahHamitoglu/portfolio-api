import { Router } from "express";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    searchProjects,
} from "../controllers/project.controller";
import { authenticateToken } from "../middleware/authToken";
import { removeImages } from "../controllers/uploadImage";

const router = Router();


// Route to fetch all projects
router.get('/', getAllProjects);

// Route to create a new project
router.post('/', authenticateToken, createProject);

// Update project route
router.put('/:id', authenticateToken, updateProject);

// Route to fetch a single project
router.get('/:id', getProjectById);

// Delete project route
router.delete('/:id', authenticateToken, removeImages, deleteProject);

// Delete all projects route
router.delete('/', authenticateToken, removeImages, deleteAllProjects);

// Search projects route
router.get('/search/:query', authenticateToken, searchProjects);

export const ProjectRoutes = router;