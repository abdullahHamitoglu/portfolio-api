import jwt from 'jsonwebtoken';
import express, { Router } from "express";
import User, { IUser } from "../database/models/User";
import { secretKey } from '../controllers/authToken';


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



export const AuthRoutes = router;