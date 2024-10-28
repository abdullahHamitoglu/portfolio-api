import { Router } from 'express';
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
    getUsersByDomain,
} from '../controllers/user.controller';

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/users', authenticateToken, getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', authenticateToken, updateUser);
router.get('/users/domain/:domain', getUsersByDomain);
router.delete('/user/:id', deleteUser);
router.put('/profile', upload.fields([{ name: 'profile_picture', maxCount: 1 }]), authenticateToken, updateUserProfile);

export const UsersRoutes: Router = router;
