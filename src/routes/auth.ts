import jwt from 'jsonwebtoken';
import express, { Router } from "express";
import User, { IUser } from "../database/models/User";
import { secretKey } from '../controllers/authToken';
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
router.post('/reset-password', async (req: express.Request<{}, any, IUser>, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // validation 
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
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
            text: /** html */`Click here to reset your password: ${req.headers.origin}/reset-password/${user._id}`,
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
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error resetting password',
            message: 'Error resetting password',
            data: null,
        });
    }
});


export const AuthRoutes = router;