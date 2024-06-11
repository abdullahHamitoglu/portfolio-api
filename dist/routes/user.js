"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const User_1 = __importDefault(require("../database/models/User"));
const authToken_1 = require("../controllers/authToken");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const handleValidationErrors_1 = require("../controllers/handleValidationErrors");
const express_validator_1 = require("express-validator");
const basePath = path_1.default.join(__dirname, '../../public/uploads');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
const userProfile = (user, req) => {
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
};
router.get('/profile', authToken_1.authenticateToken, (req, res) => {
    const user = req.user;
    res.json({
        status: 'success',
        user: userProfile(user, req),
        message: 'User profile fetched successfully',
    });
});
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.json({
            status: 'success',
            users: users.map((user) => userProfile(user, req)),
            message: 'Users fetched successfully',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}));
router.post('/user/create', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], handleValidationErrors_1.HandleValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        const user = new User_1.default({
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
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, authToken_1.secretKey, {
            expiresIn: '24h',
        });
        yield user.save();
        res.json({
            status: 'success',
            user: Object.assign(Object.assign({}, userProfile(user, req)), { token }),
            message: 'User created successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
}));
router.delete('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}));
router.put('/profile', upload.fields([{ name: 'profilePicture', maxCount: 1 }]), authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.updatedAt = new Date();
    try {
        const user = yield User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        const updatedUserData = Object.assign(Object.assign(Object.assign({}, user.toObject()), req.body), { profilePicture: user.profilePicture });
        if (req.files && 'profilePicture' in req.files) {
            const image = req.files['profilePicture'];
            if (image.length > 0) {
                const imageFile = image[0];
                updatedUserData.profilePicture = `/uploads/${imageFile.filename}`;
            }
        }
        user.set(updatedUserData);
        yield user.save();
        res.json({
            status: 'success',
            user: userProfile(user, req),
            message: 'User updated successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            user: null,
            message: error.message ? error.message : error.toString(),
        });
    }
}));
router.put('/contact', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.updatedAt = new Date();
    try {
        const user = yield User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        const updatedUserData = Object.assign(Object.assign({}, user.toObject()), req.body);
        user.set(updatedUserData);
        yield user.save();
        res.json({
            status: 'success',
            user: userProfile(user, req),
            message: 'User updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            user: null,
            message: error.message ? error.message : error.toString(),
        });
    }
}));
exports.UsersRoutes = router;
//# sourceMappingURL=user.js.map