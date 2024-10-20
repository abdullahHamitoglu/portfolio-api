"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const user_route_1 = require("./user.route");
const auth_route_1 = require("./auth.route");
const project_route_1 = require("./project.route");
const skills_route_1 = require("./skills.route");
const client_route_1 = require("./client.route");
const contact_route_1 = require("./contact.route");
const experience_route_1 = require("./experience.route");
const order_route_1 = require("./order.route");
const category_route_1 = require("./category.route");
const pages_route_1 = require("./pages.route");
const storage_route_1 = require("./storage.route");
const swagger_controller_1 = __importDefault(require("../controllers/swagger.controller"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const router = (0, express_1.Router)();
const swaggerDocs = (0, swagger_jsdoc_1.default)(swagger_controller_1.default);
router.use('', user_route_1.UsersRoutes);
router.use('/auth', auth_route_1.AuthRoutes);
router.use('/projects', project_route_1.ProjectRoutes);
router.use('/categories', category_route_1.CategoryRoutes);
router.use('/skills', skills_route_1.SkillsRouter);
router.use('/experiences', experience_route_1.ExperienceRoute);
router.use('/clients', client_route_1.ClientRoutes);
router.use('/contact', contact_route_1.ContactRoutes);
router.use('/orders', order_route_1.OrderRoutes);
router.use('/pages', pages_route_1.PagesRoute);
router.use('/storage', storage_route_1.StorageRoutes);
router.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
router.use((req, res) => (res.status(404).json({
    status: 404,
    message: 'Route Not Found',
    data: null,
})));
exports.MainRouter = router;
//# sourceMappingURL=index.js.map