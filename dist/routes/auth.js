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
router.post('/send-reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.query.email });
        // validation 
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
        if (!user.email) {
            return res.status(401).json({
                status: 'error',
                message: 'Email is required',
                data: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email }, authToken_1.secretKey, {
            expiresIn: '12h',
        });
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
            text: `Click here to reset your password: ${req.headers.origin}/reset-password/${token}`,
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
                data: {
                    username: user.username,
                    email: user.email,
                    token,
                },
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
// reset password
router.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation 
        if (!req.query.token) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is required',
                data: null,
            });
        }
        if (jsonwebtoken_1.default.verify(req.query.token, authToken_1.secretKey)) {
            const decoded = jsonwebtoken_1.default.verify(req.query.token, authToken_1.secretKey);
            const user = yield User_1.default.findOne({ email: decoded.email });
            // validation 
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                    data: null,
                });
            }
            if (decoded.email !== user.email) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token',
                    data: null,
                });
            }
            if (user.password === req.query.new_password) {
                return res.status(401).json({
                    status: 'error',
                    message: 'New password cannot be the same as the old password',
                    data: null,
                });
            }
            if (req.query.new_password.length < 8) {
                return res.status(401).json({
                    status: 'error',
                    message: 'New password must be at least 8 characters long',
                    data: null,
                });
            }
            if (req.query.new_password.length > 72) {
                return res.status(401).json({
                    status: 'error',
                    message: 'New password must be at most 72 characters long',
                    data: null,
                });
            }
            if (req.query.new_password.includes(user.password)) {
                return res.status(401).json({
                    status: 'error',
                    message: 'New password cannot be the same as the old password',
                    data: null,
                });
            }
            user.password = req.query.new_password;
            yield user.save();
            res.json({
                status: 'success',
                message: 'Password changed successfully',
                data: {
                    username: user.username,
                    email: user.email,
                },
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error changing password',
            message: 'Error changing password',
            data: null,
        });
    }
}));
// change password
router.put('/change-password', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.body.user_id);
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
        if (req.body.new_password !== req.body.confirm_password) {
            return res.status(401).json({
                status: 'error',
                message: 'New password and confirm password do not match',
                data: null,
            });
        }
        if (req.body.new_password.length < 8) {
            return res.status(401).json({
                status: 'error',
                message: 'New password must be at least 8 characters long',
                data: null,
            });
        }
        if (req.body.new_password.length > 72) {
            return res.status(401).json({
                status: 'error',
                message: 'New password must be at most 72 characters long',
                data: null,
            });
        }
        if (req.body.new_password.includes(req.body.password)) {
            return res.status(401).json({
                status: 'error',
                message: 'New password cannot be the same as the old password',
                data: null,
            });
        }
        user.password = req.body.new_password;
        yield user.save();
        res.json({
            status: 'success',
            message: 'Password changed successfully',
            data: null,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error changing password',
            error: error.message ? error.message : error.toString(),
            data: null,
        });
    }
}));
exports.AuthRoutes = router;
//# sourceMappingURL=auth.js.map