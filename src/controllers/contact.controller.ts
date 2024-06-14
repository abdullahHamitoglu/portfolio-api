import { Request, Response } from "express";
import ContactMessage, { IContactMessage } from "../database/models/Contact.model";
import { check, validationResult } from "express-validator";

export const createContactMessage = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, message } = req.body;
        const contactMessage: IContactMessage = new ContactMessage({
            name,
            email,
            message
        });

        await contactMessage.save();
        res.json({
            status: "success",
            data: contactMessage,
            message: "Contact message sent successfully",
        });
    } catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating contact message',
        });
    }
};

export const getContactMessages = async (req: Request, res: Response) => {
    try {
        const messages: IContactMessage[] = await ContactMessage.find();
        res.json({
            status: "success",
            data: messages,
            message: "Contact messages fetched successfully",
        });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching contact messages',
        });
    }
};

export const getContactMessageById = async (req: Request, res: Response) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (!message) {
            return res.status(404).json({
                status: "error",
                message: "Contact message not found",
            });
        }
        res.json({
            status: "success",
            data: message,
            message: "Contact message fetched successfully",
        });
    } catch (error) {
        console.error('Error fetching contact message:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching contact message',
        });
    }
};

export const deleteContactMessage = async (req: Request, res: Response) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({
                status: "error",
                message: "Contact message not found",
            });
        }
        res.json({
            status: "success",
            data: message,
            message: "Contact message deleted successfully",
        });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting contact message',
        });
    }
};
