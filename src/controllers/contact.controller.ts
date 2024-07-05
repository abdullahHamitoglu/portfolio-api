import { Request, Response } from "express";
import ContactMessage, { IContactMessage } from "../database/models/Contact.model";
import { validationResult } from "express-validator";
import { categoryFields } from "./category.controller";
import { LocaleKeys } from "index";

const contactFields = (contact: IContactMessage, locale?: LocaleKeys) => {
    return {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        service: categoryFields(contact.service, locale),
        message: contact.message,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
    }
}
export const createContactMessage = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const contactMessage: IContactMessage = new ContactMessage(req.body);
        const locale = req.query.locale as LocaleKeys || 'en';

        await contactMessage.save();

        res.json({
            status: "success",
            contact: contactFields(contactMessage, locale),
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
        const { page = 1, limit = 10 } = req.query;
        const locale = req.query.locale as LocaleKeys || 'en';

        const messages: IContactMessage[] = await ContactMessage
            .find()
            .populate('service') // Populate the category field
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        ;
        const total = await ContactMessage.countDocuments();
        res.json({
            status: "success",
            contacts: messages.map(massage => (contactFields(massage, locale))),
            message: "Contact messages fetched successfully",
            total: total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
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
        const locale = req.query.locale as LocaleKeys || 'en';
        if (!message) {
            return res.status(404).json({
                status: "error",
                message: "Contact message not found",
            });
        }
        res.json({
            status: "success",
            contact: contactFields(message, locale),
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
