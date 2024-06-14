import { Router } from "express";
import { check } from "express-validator";
import {
    createOrder,
    getOrders,
    getOrderById,
    deleteOrder,
    updateOrder
} from "../controllers/order.controller";
import { HandleValidationErrors } from "../middleware/handleValidationErrors";
import { authenticateToken } from "../middleware/authToken";

const router = Router();

router.post(
    '/',
    authenticateToken,
    [
        check('project').notEmpty().withMessage('Project is required'),
        check('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
        check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        check('userId').notEmpty().withMessage('User ID is required'),
    ],
    HandleValidationErrors,
    createOrder
);

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.delete("/:id", authenticateToken, deleteOrder);
router.put(
    "/:id",
    authenticateToken,
    [
        check('project').notEmpty().withMessage('Project is required'),
        check('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
        check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        check('userId').notEmpty().withMessage('User ID is required'),
    ],
    HandleValidationErrors,
    updateOrder
);

export const OrderRoutes = router
