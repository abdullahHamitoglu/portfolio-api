"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authToken_1 = require("../middleware/authToken");
const user_controller_1 = require("../controllers/user.controller");
const handleValidationErrors_1 = require("../middleware/handleValidationErrors");
const router = (0, express_1.Router)();
router.get('/profile', authToken_1.authenticateToken, user_controller_1.getUserProfile);
router.get('/users', user_controller_1.getUsers);
router.post('/user/create', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], handleValidationErrors_1.HandleValidationErrors, user_controller_1.createUser);
router.delete('/user/:id', user_controller_1.deleteUser);
router.put('/profile', user_controller_1.upload.fields([{ name: 'profilePicture', maxCount: 1 }]), authToken_1.authenticateToken, user_controller_1.updateUserProfile);
exports.UsersRoutes = router;
//# sourceMappingURL=user.route.js.map