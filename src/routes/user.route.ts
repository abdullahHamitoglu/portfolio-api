import { Router } from 'express';
import { check } from 'express-validator';
import { authenticateToken } from '../middleware/authToken';
import {
    getUserProfile,
    getUsers,
    createUser,
    deleteUser,
    updateUserProfile,
    upload,
    getUser,
    updateUser,
} from '../controllers/user.controller';
import { HandleValidationErrors } from '../middleware/handleValidationErrors';

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', authenticateToken, updateUser);
router.post('/user/create',
    [
        check('email').isEmail().withMessage('Valid email is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    HandleValidationErrors,
    createUser
);
router.delete('/user/:id', deleteUser);
router.put('/profile', upload.fields([{ name: 'profile_picture', maxCount: 1 }]), authenticateToken, updateUserProfile);

export const UsersRoutes: Router = router;
