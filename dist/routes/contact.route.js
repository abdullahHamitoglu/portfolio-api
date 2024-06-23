"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const contact_controller_1 = require("../controllers/contact.controller");
const handleValidationErrors_1 = require("../middleware/handleValidationErrors");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.check)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.check)('message').notEmpty().withMessage('Message is required')
], handleValidationErrors_1.HandleValidationErrors, contact_controller_1.createContactMessage);
router.get("/", contact_controller_1.getContactMessages);
router.get("/:id", contact_controller_1.getContactMessageById);
router.delete("/:id", contact_controller_1.deleteContactMessage);
exports.ContactRoutes = router;
//# sourceMappingURL=contact.route.js.map