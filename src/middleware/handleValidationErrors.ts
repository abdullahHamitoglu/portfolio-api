import { Request, Response } from "express";
import { validationResult } from "express-validator";

// Middleware to handle validation errors
export const HandleValidationErrors = (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array(),
            message: 'Validation error',
        });
    }
    next();
};