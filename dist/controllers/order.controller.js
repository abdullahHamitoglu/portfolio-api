"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.deleteOrder = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../database/models/order.model"));
const express_validator_1 = require("express-validator");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { project, quantity, price, userId, status } = req.body;
        const order = new order_model_1.default({
            project,
            quantity,
            price,
            userId,
            status
        });
        yield order.save();
        res.json({
            status: "success",
            data: order,
            message: "Order created successfully",
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating order',
        });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find();
        res.json({
            status: "success",
            data: orders,
            message: "Orders fetched successfully",
        });
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching orders',
        });
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found",
            });
        }
        res.json({
            status: "success",
            data: order,
            message: "Order fetched successfully",
        });
    }
    catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching order',
        });
    }
});
exports.getOrderById = getOrderById;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.default.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found",
            });
        }
        res.json({
            status: "success",
            data: order,
            message: "Order deleted successfully",
        });
    }
    catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting order',
        });
    }
});
exports.deleteOrder = deleteOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const order = yield order_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found",
            });
        }
        res.json({
            status: "success",
            data: order,
            message: "Order updated successfully",
        });
    }
    catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error updating order',
        });
    }
});
exports.updateOrder = updateOrder;
//# sourceMappingURL=order.controller.js.map