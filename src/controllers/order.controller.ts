import { Request, Response } from "express";
import Order, { IOrder } from "../database/models/order.model";
import { validationResult } from "express-validator";

export const createOrder = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { project, quantity, price, userId, status } = req.body;
        const order: IOrder = new Order({
            project,
            quantity,
            price,
            userId,
            status
        });

        await order.save();
        res.json({
            status: "success",
            data: order,
            message: "Order created successfully",
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating order',
        });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders: IOrder[] = await Order.find();
        res.json({
            status: "success",
            data: orders,
            message: "Orders fetched successfully",
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching orders',
        });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);
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
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching order',
        });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
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
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting order',
        });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error updating order',
        });
    }
};
