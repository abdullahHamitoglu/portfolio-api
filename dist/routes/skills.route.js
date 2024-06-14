"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authToken_1 = require("../middleware/authToken");
const skill_controller_1 = require("../controllers/skill.controller");
const handleValidationErrors_1 = require("../middleware/handleValidationErrors");
const router = (0, express_1.Router)();
router.post('/', authToken_1.authenticateToken, skill_controller_1.upload.fields([{ name: 'image', maxCount: 1 }]), [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
], handleValidationErrors_1.HandleValidationErrors, skill_controller_1.createSkill);
router.get("/", skill_controller_1.getSkills);
router.get("/:id", skill_controller_1.getSkillById);
router.delete("/:id", authToken_1.authenticateToken, skill_controller_1.deleteSkill);
router.put("/:id", authToken_1.authenticateToken, skill_controller_1.updateSkill);
exports.SkillsRouter = router;
//# sourceMappingURL=skills.route.js.map