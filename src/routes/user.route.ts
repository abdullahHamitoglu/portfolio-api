import { Router } from 'express';
import { check } from 'express-validator';
import { authenticateToken } from '../middleware/authToken';
import {
    getUserProfile,
    getUsers,
    createUser,
    deleteUser,
    updateUserProfile,
    updateUserContact,
    upload
} from '../controllers/user.controller';
import { HandleValidationErrors } from '../middleware/handleValidationErrors';

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/users', getUsers);
router.post('/user/create',
    [
        check('email').isEmail().withMessage('Valid email is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    HandleValidationErrors,
    createUser
);
router.delete('/user/:id', deleteUser);
router.put('/profile', upload.fields([{ name: 'profilePicture', maxCount: 1 }]), authenticateToken, updateUserProfile);
router.put('/contact', authenticateToken, updateUserContact);

export const UsersRoutes: Router = router;
