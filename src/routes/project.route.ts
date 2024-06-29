import { Router } from "express";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
} from "../controllers/project.controller";
import { authenticateToken } from "../middleware/authToken";

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
router.delete('/:id', authenticateToken, deleteProject);

// Delete all projects route
router.delete('/', authenticateToken, deleteAllProjects);


export const ProjectRoutes = router;