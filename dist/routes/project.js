"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const authToken_1 = require("../controllers/authToken");
const uploadImage_1 = require("../controllers/uploadImage");
const router = (0, express_1.Router)();
router.get('/', project_controller_1.getAllProjects);
router.post('/', authToken_1.authenticateToken, project_controller_1.createProject);
router.put('/:id', authToken_1.authenticateToken, project_controller_1.updateProject);
router.get('/:id', project_controller_1.getProjectById);
router.delete('/:id', authToken_1.authenticateToken, uploadImage_1.removeImages, project_controller_1.deleteProject);
router.delete('/', authToken_1.authenticateToken, uploadImage_1.removeImages, project_controller_1.deleteAllProjects);
router.get('/search/:query', authToken_1.authenticateToken, project_controller_1.searchProjects);
exports.ProjectRoutes = router;
//# sourceMappingURL=project.js.map