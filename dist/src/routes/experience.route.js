"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const experience_controller_1 = require("../controllers/experience.controller");
const handleValidationErrors_1 = require("../middleware/handleValidationErrors");
const authToken_1 = require("../middleware/authToken");
const router = (0, express_1.Router)();
router.post('/', authToken_1.authenticateToken, [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.check)('company').notEmpty().withMessage('Company is required'),
    (0, express_validator_1.check)('location').notEmpty().withMessage('Location is required'),
    (0, express_validator_1.check)('from').notEmpty().withMessage('From date is required'),
    (0, express_validator_1.check)('description').notEmpty().withMessage('Description is required')
], handleValidationErrors_1.HandleValidationErrors, experience_controller_1.createExperience);
router.get("/", experience_controller_1.getExperiences);
router.get("/:id", experience_controller_1.getExperienceById);
router.delete("/:id", authToken_1.authenticateToken, experience_controller_1.deleteExperience);
router.put("/:id", authToken_1.authenticateToken, [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.check)('company').notEmpty().withMessage('Company is required'),
    (0, express_validator_1.check)('location').notEmpty().withMessage('Location is required'),
    (0, express_validator_1.check)('from').notEmpty().withMessage('From date is required'),
    (0, express_validator_1.check)('description').notEmpty().withMessage('Description is required')
], handleValidationErrors_1.HandleValidationErrors, experience_controller_1.updateExperience);
exports.ExperienceRoute = router;
//# sourceMappingURL=experience.route.js.map