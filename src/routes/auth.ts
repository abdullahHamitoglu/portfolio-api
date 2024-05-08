import jwt from 'jsonwebtoken';
import express, { Router } from "express";
import User, { IUser } from "../database/models/User";
import { authenticateToken, secretKey } from '../controllers/authToken';
import nodemailer from 'nodemailer';

const router: Router = Router();

// login 
router.post('/login', async (req: express.Request<{}, any, IUser>, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
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
        const token = jwt.sign({ userId: user._id }, secretKey, {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in user' });
    }
});
// reset password 
router.post('/send-reset-password', async (req: express.Request<{}, any, { email: string }>, res) => {
    try {
        const user = await User.findOne({ email: req.query.email });
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
        const token = jwt.sign({ email: user.email }, secretKey, {
            expiresIn: '12h',
        });
        const transporter = nodemailer.createTransport({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error resetting password',
            message: 'Error resetting password',
            data: null,
        });
    }
});
// reset password
router.post(
    '/reset-password',
    async (
        req: any,
        res
    ) => {
        try {
            // validation 
            if (!req.query.token) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token is required',
                    data: null,
                });
            }
            if (jwt.verify(req.query.token, secretKey)) {
                const decoded = jwt.verify(req.query.token, secretKey) as { email: string };
                const user = await User.findOne({ email: decoded.email });
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
                await user.save();
                res.json({
                    status: 'success',
                    message: 'Password changed successfully',
                    data: {
                        username: user.username,
                        email: user.email,
                    },
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'Error changing password',
                message: 'Error changing password',
                data: null,
            });
        }
    }
);
// change password
router.put(
    '/change-password',
    authenticateToken,
    async (
        req:
            express.Request<{},
                any,
                {
                    user_id: string,
                    password: string,
                    new_password: string,
                    confirm_password: string
                }
            >,
        res
    ) => {
        try {
            const user = await User.findById(req.body.user_id);
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
            await user.save();
            res.json({
                status: 'success',
                message: 'Password changed successfully',
                data: null,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error changing password',
                error: error.message ? error.message : error.toString(),
                data: null,
            });
        }
    }
);

export const AuthRoutes = router;

