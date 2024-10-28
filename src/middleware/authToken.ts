import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
import User, { IUser } from "../database/models/User.model";

export const secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDIyMTUyNywiaWF0IjoxNzE0MjIxNTI3fQ.s3yQikiTmhhHHh2QKiozLT8RswK0LATLVZ2ktfTkfhs";

export const authenticateToken: (req: Request & { user?: IUser }, res: Response, next: NextFunction) => Promise<void> = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header is missing
    
    if (!authHeader) {
        res.status(401).json({
            status: 'error',
            data: null,
            message: 'Authorization header missing'
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    // Check if token is missing
    if (!token) {
        res.status(401).json({ error: 'Token missing' });
        return;
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey) as { userId: string };

        // Fetch user data
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null
            });
            return;
        }

        // Attach user data to req object and continue to next handler
        req.user = user;
        next(); // Proceed to the next middleware/route handler

    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({
            status: 'error',
            data: null,
            message: 'Invalid token'
        });
    }
};
