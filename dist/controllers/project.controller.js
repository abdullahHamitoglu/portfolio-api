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
exports.searchProjects = exports.deleteAllProjects = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const Projects_model_1 = __importDefault(require("../database/models/Projects.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const projectFields = (project) => ({
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
function getAllProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10, featured } = req.query;
            const projects = yield Projects_model_1.default
                .find({ featured: featured })
                .populate('category')
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            const totalProjects = yield Projects_model_1.default.countDocuments();
            res.json({
                status: 'success',
                message: 'Projects fetched successfully',
                projects: projects.map(project => projectFields(project)),
                total: totalProjects,
                page: Number(page),
                pages: Math.ceil(totalProjects / Number(limit)),
            });
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ error: 'Error fetching projects' });
        }
    });
}
exports.getAllProjects = getAllProjects;
function searchProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const projects = yield Projects_model_1.default.find({ $text: { $search: query } })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            const totalProjects = yield Projects_model_1.default.countDocuments({ $text: { $search: query } });
            res.json({
                status: 'success',
                projects: projects.map(project => projectFields(project)),
                message: 'Projects fetched successfully',
                total: totalProjects,
                page: Number(page),
                pages: Math.ceil(totalProjects / Number(limit)),
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching projects' });
        }
    });
}
exports.searchProjects = searchProjects;
function getProjectById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield Projects_model_1.default.findById(req.params.id);
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching project' });
        }
    });
}
exports.getProjectById = getProjectById;
function createProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield Projects_model_1.default.create(req.body);
            res.json({
                status: 'success',
                project: projectFields(project),
                message: 'Project created successfully',
            });
        }
        catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error creating project',
                error: 'Error creating project',
            });
        }
    });
}
exports.createProject = createProject;
function updateProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let project = yield Projects_model_1.default.findOneAndUpdate({ _id: req.body.id }, req.body, {
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
                project.images = [...project.images, ...req.body.images];
                yield project.save();
            }
            res.json({
                status: 'success',
                data: projectFields(project),
                message: 'Project updated successfully',
            });
        }
        catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ error: 'Error updating project' });
        }
    });
}
exports.updateProject = updateProject;
function deleteProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield Projects_model_1.default.findOneAndDelete({ _id: req.params.id });
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
    });
}
exports.deleteProject = deleteProject;
function deleteAllProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const projects = yield Projects_model_1.default.find();
        if (projects.length <= 0) {
            return res.status(401).json({
                status: 'error',
                error: 'No projects to delete',
                message: 'No projects to delete',
            });
        }
        try {
            yield Projects_model_1.default.deleteMany({});
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
    });
}
exports.deleteAllProjects = deleteAllProjects;
//# sourceMappingURL=project.controller.js.map