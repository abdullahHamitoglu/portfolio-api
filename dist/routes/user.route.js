"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = require("express");
const authToken_1 = require("../middleware/authToken");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get('/profile', authToken_1.authenticateToken, user_controller_1.getUserProfile);
router.get('/users', authToken_1.authenticateToken, user_controller_1.getUsers);
router.post('/users', user_controller_1.createUser);
router.get('/users/:id', user_controller_1.getUser);
router.put('/users/:id', authToken_1.authenticateToken, user_controller_1.updateUser);
router.get('/users/domain/:domain', user_controller_1.getUsersByDomain);
router.delete('/user/:id', user_controller_1.deleteUser);
router.put('/profile', user_controller_1.upload.fields([{ name: 'profile_picture', maxCount: 1 }]), authToken_1.authenticateToken, user_controller_1.updateUserProfile);
exports.UsersRoutes = router;
//# sourceMappingURL=user.route.js.map