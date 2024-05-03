"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const auth_1 = require("./auth");
const project_1 = require("./project");
const skills_1 = require("./skills");
const router = (0, express_1.Router)();
router.use('/', user_1.UsersRoutes);
router.use('/auth', auth_1.AuthRoutes);
router.use('/projects', project_1.ProjectRoutes);
router.use('/skills', skills_1.SkillsRouter);
router.use((req, res) => {
    res.status(404).send('Not found');
});
exports.MainRouter = router;
//# sourceMappingURL=index.js.map