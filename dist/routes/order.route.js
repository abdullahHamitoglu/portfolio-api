"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const order_controller_1 = require("../controllers/order.controller");
const handleValidationErrors_1 = require("../middleware/handleValidationErrors");
const authToken_1 = require("../middleware/authToken");
const router = (0, express_1.Router)();
router.post('/', authToken_1.authenticateToken, [
    (0, express_validator_1.check)('project').notEmpty().withMessage('Project is required'),
    (0, express_validator_1.check)('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    (0, express_validator_1.check)('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.check)('userId').notEmpty().withMessage('User ID is required'),
], handleValidationErrors_1.HandleValidationErrors, order_controller_1.createOrder);
router.get("/", order_controller_1.getOrders);
router.get("/:id", order_controller_1.getOrderById);
router.delete("/:id", authToken_1.authenticateToken, order_controller_1.deleteOrder);
router.put("/:id", authToken_1.authenticateToken, [
    (0, express_validator_1.check)('project').notEmpty().withMessage('Project is required'),
    (0, express_validator_1.check)('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    (0, express_validator_1.check)('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.check)('userId').notEmpty().withMessage('User ID is required'),
], handleValidationErrors_1.HandleValidationErrors, order_controller_1.updateOrder);
exports.OrderRoutes = router;
//# sourceMappingURL=order.route.js.map