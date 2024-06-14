import { Router } from "express";
import { check } from "express-validator";
import {
    createContactMessage,
    getContactMessages,
    getContactMessageById,
    deleteContactMessage
} from "../controllers/contact.controller";
import { HandleValidationErrors } from "../middleware/handleValidationErrors";

const router = Router();

router.post(
    '/',
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Valid email is required'),
        check('message').notEmpty().withMessage('Message is required')
    ],
    HandleValidationErrors,
    createContactMessage
);

router.get("/", getContactMessages);
router.get("/:id", getContactMessageById);
router.delete("/:id", deleteContactMessage);

export const ContactRoutes = router;
