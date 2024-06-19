"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const category_controller_1 = require("../controllers/category.controller");
const handleValidationErrors_1 = require("../middleware/handleValidationErrors");
const authToken_1 = require("../middleware/authToken");
const router = (0, express_1.Router)();
router.post('/', authToken_1.authenticateToken, [
    (0, express_validator_1.check)('name').notEmpty().withMessage('Name is required'),
], handleValidationErrors_1.HandleValidationErrors, category_controller_1.createCategory);
router.get("/", category_controller_1.getCategories);
router.get("/:id", category_controller_1.getCategoryById);
router.delete("/:id", authToken_1.authenticateToken, category_controller_1.deleteCategory);
router.put("/:id", authToken_1.authenticateToken, [(0, express_validator_1.check)('name').notEmpty().withMessage('Name is required'),], handleValidationErrors_1.HandleValidationErrors, category_controller_1.updateCategory);
exports.CategoryRoutes = router;
//# sourceMappingURL=category.route.js.map