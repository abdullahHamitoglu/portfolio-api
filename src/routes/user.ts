import jwt from 'jsonwebtoken';
import express, { NextFunction, Request, Response, Router } from 'express';
import User, { IUser } from '../database/models/User';
import { authenticateToken, secretKey } from '../controllers/authToken';

const app = express();

const router = Router();

router.get('/profile', authenticateToken, (req: any, res: Response) => {
    const user = req.user as IUser;

    res.json({
        status: 'success',
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        message: 'User profile fetched successfully',
    });
});

router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            status: 'success',
            data: users.map((user: IUser) => ({
                id: user._id,
                username: user.username,
                email: user.email,
            })),
            message: 'Users fetched successfully',
        });

    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

router.post('/user/create', async (req: express.Request<{}, any, IUser>, res) => {

    try {
        const users = await User.find();
        const user = new User({
            id: users.length + 1,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        // not create same users
        if (users.some(u => u.username === user.username)) {
            return res.status(400).json({
                status: 'error',
                message: 'Username already exists',
                data: null,
            });
        }
        if (users.some(u => u.email === user.email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already exists',
                data: null,
            });
        }
        // Generate token with user ID
        const token = jwt.sign({ userId: user._id }, secretKey, {
            expiresIn: '24h',
        });

        await user.save();
        res.json({
            status: 'success',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                token
            },
            message: 'User created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
});
// delete user 
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
        res.json({
            status: 'success',
            data: null,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});
// update profile 
router.put('/profile', authenticateToken, async (
    req: any,
    res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
        res.json({
            status: 'success',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            message: 'User updated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

export const UsersRoutes: Router = router;