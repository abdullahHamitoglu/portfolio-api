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
const express_validator_1 = require("express-validator");
const User_model_1 = __importDefault(require("../database/models/User.model"));
const authToken_1 = require("../middleware/authToken");
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.check)('email').notEmpty().withMessage('email is required'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = yield User_model_1.default.findOne({ email: req.body.email });
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
                user: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, authToken_1.secretKey, {
            expiresIn: '24h',
        });
        res.json({
            status: 'success',
            user: {
                email: user.email,
                name: user.name,
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
router.post('/send-reset-password', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Valid email is required')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = yield User_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        if (!user.email) {
            return res.status(401).json({
                status: 'error',
                message: 'Email is required',
                user: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email }, authToken_1.secretKey, {
            expiresIn: '12h',
        });
        const htmlFilePath = path_1.default.join(__dirname, '../../public/content.html');
        let htmlContent = fs_1.default.readFileSync(htmlFilePath, 'utf8');
        htmlContent = htmlContent.replace('{{name}}', user.name);
        htmlContent = htmlContent.replace('{{operating_system}}', req.headers['user-agent']);
        htmlContent = htmlContent.replace('{{browser_name}}', req.headers['user-agent']);
        htmlContent = htmlContent.replace('{{action_url}}', `https://momen.design/reset-password/${token}`);
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
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
            html: htmlContent,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    error: 'Error sending email',
                    message: 'Error sending email',
                    user: null,
                });
            }
            res.json({
                status: 'success',
                message: 'Email sent successfully',
                user: {
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
router.post('/reset-password', [
    (0, express_validator_1.check)('token').notEmpty().withMessage('Token is required'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(req.body.token, authToken_1.secretKey);
        const user = yield User_model_1.default.findOne({ email: decoded.email });
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
                user: null,
            });
        }
        user.password = req.body.new_password;
        yield user.save();
        res.json({
            status: 'success',
            message: 'Password changed successfully',
            user: {
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error changing password',
            message: error.toString(),
            user: null,
        });
    }
}));
router.put('/change-password', authToken_1.authenticateToken, [
    (0, express_validator_1.check)('user_id').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required'),
    (0, express_validator_1.check)('new_password').isLength({ min: 8, max: 72 }).withMessage('New password must be between 8 and 72 characters long'),
    (0, express_validator_1.check)('confirm_password').custom((value, { req }) => {
        if (value !== req.body.new_password) {
            throw new Error('New password and confirm password do not match');
        }
        return true;
    })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = yield User_model_1.default.findById(req.body.user_id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        if (user.password !== req.body.password) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid password',
                user: null,
            });
        }
        user.password = req.body.new_password;
        yield user.save();
        res.json({
            status: 'success',
            message: 'Password changed successfully',
            user: null,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error changing password',
            error: error.message ? error.message : error.toString(),
            user: null,
        });
    }
}));
exports.AuthRoutes = router;
//# sourceMappingURL=auth.route.js.map