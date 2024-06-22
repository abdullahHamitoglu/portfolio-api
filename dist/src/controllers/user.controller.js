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
exports.updateUserContact = exports.updateUserProfile = exports.deleteUser = exports.createUser = exports.getUsers = exports.getUserProfile = exports.upload = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../database/models/User.model"));
const authToken_1 = require("../middleware/authToken");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
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
exports.upload = (0, multer_1.default)({ storage });
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
const getUserProfile = (req, res) => {
    const user = req.user;
    res.json({
        status: 'success',
        user: userProfile(user, req),
        message: 'User profile fetched successfully',
    });
};
exports.getUserProfile = getUserProfile;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find();
        res.json({
            status: 'success',
            users: users.map((user) => userProfile(user, req)),
            message: 'Users fetched successfully',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find();
        const user = new User_model_1.default({
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
});
exports.updateUserProfile = updateUserProfile;
const updateUserContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.updateUserContact = updateUserContact;
//# sourceMappingURL=user.controller.js.map