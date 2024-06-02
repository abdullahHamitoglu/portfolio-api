"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
// Middleware to handle validation errors
const HandleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array(),
            message: 'Validation error',
        });
    }
    next();
};
exports.HandleValidationErrors = HandleValidationErrors;
//# sourceMappingURL=handleValidationErrors.js.map