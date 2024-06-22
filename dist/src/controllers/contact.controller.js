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
exports.deleteContactMessage = exports.getContactMessageById = exports.getContactMessages = exports.createContactMessage = void 0;
const Contact_model_1 = __importDefault(require("../database/models/Contact.model"));
const express_validator_1 = require("express-validator");
const contactFields = (contact) => {
    return {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        service: contact.service,
        message: contact.message,
    };
};
const createContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const contactMessage = new Contact_model_1.default(req.body);
        yield contactMessage.save();
        res.json({
            status: "success",
            data: contactFields(contactMessage),
            message: "Contact message sent successfully",
        });
    }
    catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error creating contact message',
        });
    }
});
exports.createContactMessage = createContactMessage;
const getContactMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const messages = yield Contact_model_1.default
            .find()
            .populate('service')
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        ;
        const total = yield Contact_model_1.default.countDocuments();
        res.json({
            status: "success",
            contacts: messages.map(massage => (contactFields(massage))),
            message: "Contact messages fetched successfully",
            total: total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
        });
    }
    catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching contact messages',
        });
    }
});
exports.getContactMessages = getContactMessages;
const getContactMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield Contact_model_1.default.findById(req.params.id);
        if (!message) {
            return res.status(404).json({
                status: "error",
                message: "Contact message not found",
            });
        }
        res.json({
            status: "success",
            contact: message,
            message: "Contact message fetched successfully",
        });
    }
    catch (error) {
        console.error('Error fetching contact message:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error fetching contact message',
        });
    }
});
exports.getContactMessageById = getContactMessageById;
const deleteContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield Contact_model_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error deleting contact message',
        });
    }
});
exports.deleteContactMessage = deleteContactMessage;
//# sourceMappingURL=contact.controller.js.map