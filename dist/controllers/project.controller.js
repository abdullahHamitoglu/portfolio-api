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
exports.projectFields = exports.deleteAllProjects = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const Projects_model_1 = __importDefault(require("../database/models/Projects.model"));
const category_controller_1 = require("./category.controller");
const user_controller_1 = require("./user.controller");
const projectFields = (project, locale) => ({
    id: project._id,
    title: locale ? project.title[locale] : project.title,
    description: locale ? project.description[locale] : project.description,
    background: project.background,
    images: project.images,
    featured: project.featured,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    category: (0, category_controller_1.categoryFields)(project.category, locale),
    user: project.user ? (0, user_controller_1.userProfile)(project.user, {}) : ''
});
exports.projectFields = projectFields;
function getAllProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10, featured, multiLocale } = req.query;
            const locale = req.query.locale || 'en';
            const query = req.query;
            if (featured) {
                query.featured = featured === 'true';
            }
            if (req.query.category) {
                query.category = req.query.category;
            }
            if (req.query.status) {
                query.status = req.query.status;
            }
            else {
                query.status = 'active';
            }
            const projects = yield Projects_model_1.default.find(query)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('category')
                .populate('user');
            const totalProjects = yield Projects_model_1.default.countDocuments(query);
            res.json({
                status: 'success',
                message: req.t('projects_fetched_successfully'),
                projects: projects.map(project => multiLocale ? projectFields(project) : projectFields(project, locale)),
                total: totalProjects,
                page: Number(page),
                pages: Math.ceil(totalProjects / Number(limit)),
            });
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ error: req.t('error_fetching_projects') });
        }
    });
}
exports.getAllProjects = getAllProjects;
function getProjectById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const locale = req.query.locale || 'en';
            const multiLocale = req.query.multiLocale;
            const project = yield Projects_model_1.default.findById(req.params.id).populate('category').populate('user');
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: req.t('error_fetching_project') });
        }
    });
}
exports.getProjectById = getProjectById;
function createProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const locale = req.query.locale || 'en';
            const project = yield Projects_model_1.default.create(req.body);
            res.json({
                status: 'success',
                project: projectFields(project),
                message: req.t('project_created_successfully'),
            });
        }
        catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({
                status: 'error',
                message: req.t('error_creating_project'),
                error: error.message,
            });
        }
    });
}
exports.createProject = createProject;
function updateProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const locale = req.query.locale || 'en';
            let project = yield Projects_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            }).populate('category').populate('user');
            if (!project) {
                return res.status(404).json({
                    status: 'error',
                    message: req.t('project_not_found'),
                });
            }
            if (req.body.images) {
                project.images = [...project.images, ...req.body.images];
                project.images = project.images.filter((image, index, self) => self.indexOf(image) === index);
                yield project.save();
            }
            res.json({
                status: 'success',
                data: projectFields(project),
                message: req.t('project_updated_successfully'),
            });
        }
        catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ error: req.t('error_updating_project') });
        }
    });
}
exports.updateProject = updateProject;
function deleteProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield Projects_model_1.default.findByIdAndDelete(req.params.id);
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
        }
        catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ error: req.t('error_deleting_project') });
        }
    });
}
exports.deleteProject = deleteProject;
function deleteAllProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projects = yield Projects_model_1.default.find();
            if (projects.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: req.t('no_projects_to_delete'),
                    data: null,
                });
            }
            yield Projects_model_1.default.deleteMany({});
            res.json({
                status: 'success',
                data: null,
                message: req.t('projects_deleted_successfully'),
            });
        }
        catch (error) {
            console.error('Error deleting all projects:', error);
            res.status(500).json({
                status: 'error',
                message: req.t('error_deleting_projects'),
                error: error.message,
            });
        }
    });
}
exports.deleteAllProjects = deleteAllProjects;
//# sourceMappingURL=project.controller.js.map