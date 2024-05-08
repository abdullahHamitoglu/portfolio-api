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
exports.AuthRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const User_1 = __importDefault(require("../database/models/User"));
const authToken_1 = require("../controllers/authToken");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
// login 
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ username: req.body.username });
        // validation 
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
        if (user.password !== req.body.password) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid password',
                data: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, authToken_1.secretKey, {
            expiresIn: '24h',
        });
        res.json({
            status: 'success',
            data: {
                username: user.username,
                email: user.email,
                token
            },
            message: 'User logged in successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in user' });
    }
}));
// reset password 
router.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.body.email });
        // validation 
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'abdullah.developer97@gmail.com',
                pass: 'eaju cyqw akbj owps',
            },
        });
        const mailOptions = {
            from: 'abdullah.developer97@gmail.com',
            to: user.email,
            subject: 'Reset Password',
            text: /** html */ `Click here to reset your password: ${req.headers.origin}/reset-password/${user._id}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    error: 'Error sending email',
                    message: 'Error sending email',
                    data: null,
                });
            }
            res.json({
                status: 'success',
                message: 'Email sent successfully',
                data: null,
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error resetting password',
            message: 'Error resetting password',
            data: null,
        });
    }
}));
exports.AuthRoutes = router;
//# sourceMappingURL=auth.js.map