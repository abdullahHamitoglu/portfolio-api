import jwt from 'jsonwebtoken';
import express, { Router } from "express";
import { validationResult, check } from 'express-validator';
import User, { IUser } from "../database/models/User.model";
import { authenticateToken, secretKey } from '../middleware/authToken';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
const router: Router = Router();

// login 
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@momen.design
 *               password:
 *                 type: string
 *                 example: 0943570304
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: admin@momen.design
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     token:
 *                       type: string
 *                       example: jwt_token
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: email is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid password
 *       500:
 *         description: Error logging in user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error logging in user
 */
router.post('/login', [
    check('email').notEmpty().withMessage('email is required'),
    check('password').notEmpty().withMessage('Password is required')
], async (req: express.Request<{}, any, IUser>, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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
        if (user.password !== req.body.password) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid password',
                user: null,
            });
        }
        const token = jwt.sign({ userId: user._id }, secretKey, {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in user' });
    }
});

// reset password 
/**
 * @swagger
 * /send-reset-password:
 *   post:
 *     summary: Send reset password email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@momen.design
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Email sent successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: admin@momen.design
 *                     token:
 *                       type: string
 *                       example: jwt_token
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Valid email is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Error sending email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error sending email
 */
router.post('/send-reset-password', [
    check('email').isEmail().withMessage('Valid email is required')
], async (req: express.Request<{}, any, { email: string }>, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        // validation 
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
        const token = jwt.sign({ email: user.email }, secretKey, {
            expiresIn: '12h',
        });

        // Read the HTML file
        const htmlFilePath = path.join(__dirname, '../../public/content.html');
        let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

        // Replace placeholders
        htmlContent = htmlContent.replace('{{name}}', user.name);
        htmlContent = htmlContent.replace('{{operating_system}}', req.headers['user-agent']);
        htmlContent = htmlContent.replace('{{browser_name}}', req.headers['user-agent']); // You can use a library like `useragent` to get browser name separately
        htmlContent = htmlContent.replace('{{action_url}}', `https://momen.design/reset-password/${token}`);

        const transporter = nodemailer.createTransport({
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
/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: jwt_token
 *               new_password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: admin@momen.design
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Token is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid token
 *       500:
 *         description: Error changing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error changing password
 */
router.post('/reset-password', [
    check('token').notEmpty().withMessage('Token is required'),
], async (req: express.Request<{}, any, {
    new_password: string; token: string
}, { new_password: string, token: string }>, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const decoded = jwt.verify(req.body.token, secretKey) as { email: string };

        const user = await User.findOne({ email: decoded.email });

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
        await user.save();
        res.json({
            status: 'success',
            message: 'Password changed successfully',
            user: {
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error changing password',
            message: error.toString(),
            user: null,
        });
    }
});

// change password
/**
 * @swagger
 * /change-password:
 *   put:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               password:
 *                 type: string
 *                 example: old0943570304
 *               new_password:
 *                 type: string
 *                 example: new0943570304
 *               confirm_password:
 *                 type: string
 *                 example: new0943570304
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: User ID is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid password
 *       500:
 *         description: Error changing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error changing password
 */
router.put('/change-password', authenticateToken, [
    check('user_id').notEmpty().withMessage('User ID is required'),
    check('password').notEmpty().withMessage('Password is required'),
    check('new_password').isLength({ min: 8, max: 72 }).withMessage('New password must be between 8 and 72 characters long'),
    check('confirm_password').custom((value, { req }) => {
        if (value !== req.body.new_password) {
            throw new Error('New password and confirm password do not match');
        }
        return true;
    })
], async (req: express.Request<{}, any, { user_id: string, password: string, new_password: string, confirm_password: string }>, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.body.user_id);
        // validation 
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
        // Additional validation checks for new password here...

        user.password = req.body.new_password;
        await user.save();
        res.json({
            status: 'success',
            message: 'Password changed successfully',
            user: null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error changing password',
            error: error.message ? error.message : error.toString(),
            user: null,
        });
    }
});

export const AuthRoutes = router;
