"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesRoute = void 0;
const express_1 = require("express");
const pages_controller_1 = require("../controllers/pages.controller");
const authToken_1 = require("../middleware/authToken");
const router = (0, express_1.Router)();
router.get('/', pages_controller_1.getPages);
router.get('/:id', pages_controller_1.getPageById);
router.get('/slug/:slug', pages_controller_1.getPageBySlug);
router.post('/', authToken_1.authenticateToken, pages_controller_1.createPage);
router.put('/:id', authToken_1.authenticateToken, pages_controller_1.updatePage);
router.delete('/:id', authToken_1.authenticateToken, pages_controller_1.deletePage);
exports.PagesRoute = router;
//# sourceMappingURL=pages.route.js.map