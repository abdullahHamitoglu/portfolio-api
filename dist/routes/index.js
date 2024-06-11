"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const auth_1 = require("./auth");
const project_1 = require("./project");
const skills_1 = require("./skills");
const express_2 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const uploadImage_1 = require("../controllers/uploadImage");
const router = (0, express_1.Router)();
router.use('', user_1.UsersRoutes);
router.use('/auth', auth_1.AuthRoutes);
router.use('/projects', project_1.ProjectRoutes);
router.use('/skills', skills_1.SkillsRouter);
router.post('/upload', uploadMiddleware_1.default, uploadImage_1.uploadImages);
router.use(express_2.default.static(path_1.default.resolve(__dirname, '../../public')));
router.use((req, res) => (res.status(404).json({
    status: 404,
    message: 'Route Not Found',
    data: null,
})));
exports.MainRouter = router;
//# sourceMappingURL=index.js.map