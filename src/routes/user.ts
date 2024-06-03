import jwt from 'jsonwebtoken';
import express, { Request, Response, Router } from 'express';
import User, { IUser } from '../database/models/User';
import { authenticateToken, secretKey } from '../controllers/authToken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { HandleValidationErrors } from "../controllers/handleValidationErrors";
import { check } from 'express-validator';

// Set base path for uploads based on environment
const basePath = path.join(__dirname, '../../public/uploads/users/images');

// Ensure the directory exists
fs.mkdirSync(basePath, { recursive: true });

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination directory for file uploads
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        // Specify the filename for the uploaded file
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });
const router = Router();

const userProfile = (user: IUser, req: Request) => {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture ? `${req.protocol}://${req.get('host')}${user.profilePicture}` : '',
        isEmailVerified: user.isEmailVerified,
        contactsData: user.contactsData,
        resume: user.resume,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isAdmin: user.isAdmin,
    }
}

router.get('/profile', authenticateToken, (req: any, res: Response) => {
    const user = req.user as IUser;
    res.json({
        status: 'success',
        user: userProfile(user, req),
        message: 'User profile fetched successfully',
    });
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            status: 'success',
            users: users.map((user: IUser) => userProfile(user, req)),
            message: 'Users fetched successfully',
        });

    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

router.post('/user/create',
    [
        check('email').isEmail().withMessage('Valid email is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    HandleValidationErrors,
    async (req: express.Request<{}, any, IUser>, res: Response) => {

        try {
            const users = await User.find();
            const user = new User({
                email: req.body.email,
                password: req.body.password,
            });
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
                user: {
                    ...userProfile(user, req),
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
                user: null,
            });
        }
        res.json({
            status: 'success',
            user: null,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// update profile 
router.put('/profile', upload.fields([{ name: 'profilePicture', maxCount: 1 }]), authenticateToken, async (req: any, res: Response) => {
    req.body.updatedAt = new Date();
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }

        // Merge user data with updated fields
        const updatedUserData = {
            ...user.toObject(),
            ...req.body,
            profilePicture: user.profilePicture,
        };

        // Save image to storage if provided
        if (req.files && 'profilePicture' in req.files) {
            const image = req.files['profilePicture'] as Express.Multer.File[];
            if (image.length > 0) {
                const imageFile = image[0]; // Assuming only one file per field
                updatedUserData.profilePicture = `/uploads/users/images/${imageFile.filename}`;
            }
        }

        // Update user with new data
        user.set(updatedUserData);

        await user.save();
        res.json({
            status: 'success',
            user: userProfile(user, req),
            message: 'User updated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            user: null,
            message: error.message ? error.message : error.toString(),
        });
    }
});
// user contact info edit 
router.put('/contact', authenticateToken, async (req: any, res: Response) => {
    req.body.updatedAt = new Date();
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }

        // Merge user data with updated fields
        const updatedUserData = {
            ...user.toObject(),
            ...req.body,
        };

        // Update user with new data
        user.set(updatedUserData);
        await user.save();

        res.json({
            status: 'success',
            user: userProfile(user, req),
            message: 'User updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            user: null,
            message: error.message ? error.message : error.toString(),
        });
    }
})
export const UsersRoutes: Router = router;
