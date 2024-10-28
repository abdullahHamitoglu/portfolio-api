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
exports.updateUserProfile = exports.deleteUser = exports.createUser = exports.updateUser = exports.getUsersByDomain = exports.getUser = exports.getUsers = exports.getUserProfile = exports.userProfile = exports.upload = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../database/models/User.model"));
const authToken_1 = require("../middleware/authToken");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const basePath = path_1.default.join(__dirname, '../../public/uploads');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync(basePath)) {
            fs_1.default.mkdirSync(basePath, { recursive: true });
        }
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});
exports.upload = (0, multer_1.default)({ storage });
const userProfile = (user, req) => {
    return {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
        email_verified: user.email_verified,
        resume: user.resume,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        is_admin: user.is_admin,
        domain: user.domain,
    };
};
exports.userProfile = userProfile;
const getUserProfile = (req, res) => {
    const user = req.user;
    res.json({
        status: 'success',
        user: (0, exports.userProfile)(user, req),
        message: 'User profile fetched successfully',
    });
};
exports.getUserProfile = getUserProfile;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find();
        res.json({
            status: 'success',
            users: users.map((user) => (0, exports.userProfile)(user, req)),
            message: 'Users fetched successfully',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        res.json({
            status: 'success',
            user: (0, exports.userProfile)(user, req),
            message: 'User fetched successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});
exports.getUser = getUser;
const getUsersByDomain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find({ domain: req.params.domain });
        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        res.json({
            status: 'success',
            users: users.map((user) => (0, exports.userProfile)(user, req)),
            message: 'User fetched successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});
exports.getUsersByDomain = getUsersByDomain;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.password === '') {
            delete req.body.password;
        }
        let user = yield User_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        res.json({
            status: 'success',
            user: (0, exports.userProfile)(user, req),
            message: 'User updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            status: 'error',
            user: null,
            message: error.message || 'An error occurred while updating the user',
        });
    }
});
exports.updateUser = updateUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body', req.body);
    try {
        const existingUser = yield User_model_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already exists',
                data: null,
            });
        }
        const user = new User_model_1.default(req.body);
        const token = jsonwebtoken_1.default.sign({ userId: user._id || user.id }, authToken_1.secretKey, { expiresIn: '24h' });
        yield user.save();
        res.json({
            status: 'success',
            user: Object.assign(Object.assign({}, (0, exports.userProfile)(user, req)), { token }),
            message: 'User created successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
});
exports.createUser = createUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findByIdAndDelete(req.params.id);
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
});
exports.deleteUser = deleteUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.updatedAt = new Date();
    try {
        const user = yield User_model_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                user: null,
            });
        }
        const updatedUserData = Object.assign(Object.assign(Object.assign({}, user.toObject()), req.body), { profile_picture: user.profile_picture });
        if (req.files && 'profile_picture' in req.files) {
            const image = req.files['profile_picture'];
            if (image.length > 0) {
                const imageFile = image[0];
                updatedUserData.profile_picture = `/uploads/${imageFile.filename}`;
            }
        }
        user.set(updatedUserData);
        yield user.save();
        res.json({
            status: 'success',
            user: (0, exports.userProfile)(user, req),
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
});
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.controller.js.map