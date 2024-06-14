import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../database/models/User.model';
import { secretKey } from '../middleware/authToken';
import multer from 'multer';
import path from 'path';

// Set base path for uploads based on environment
const basePath = path.join(__dirname, '../../public/uploads');

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

export const upload = multer({ storage });

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
    };
}

export const getUserProfile = (req: any, res: Response) => {
    const user = req.user as IUser;
    res.json({
        status: 'success',
        user: userProfile(user, req),
        message: 'User profile fetched successfully',
    });
};

export const getUsers = async (req: Request, res: Response) => {
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
};

export const createUser = async (req: Request, res: Response) => {
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
};

export const deleteUser = async (req: Request, res: Response) => {
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
};

export const updateUserProfile = async (req: any, res: Response) => {
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
                updatedUserData.profilePicture = `/uploads/${imageFile.filename}`;
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
};

export const updateUserContact = async (req: any, res: Response) => {
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
};
