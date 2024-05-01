"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const User_1 = __importDefault(require("../database/models/User"));
const authToken_1 = require("../controllers/authToken");
const app = (0, express_1.default)();
const router = (0, express_1.Router)();
router.get('/profile', authToken_1.authenticateToken, (req, res) => {
    const user = req.user;
    res.json({
        status: 'success',
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        message: 'User profile fetched successfully',
    });
});
router.get('/users', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.json({
            status: 'success',
            data: users.map((user) => ({
                id: user._id,
                username: user.username,
                email: user.email,
            })),
            message: 'Users fetched successfully',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}));
router.post('/user/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        const user = new User_1.default({
            id: users.length + 1,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        // not create same users
        if (users.some(u => u.username === user.username)) {
            return res.status(400).json({
                status: 'error',
                message: 'Username already exists',
                data: null,
            });
        }
        if (users.some(u => u.email === user.email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already exists',
                data: null,
            });
        }
        // Generate token with user ID
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, authToken_1.secretKey, {
            expiresIn: '24h',
        });
        yield user.save();
        res.json({
            status: 'success',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                token
            },
            message: 'User created successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
}));
// delete user 
router.delete('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
        res.json({
            status: 'success',
            data: null,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}));
// update profile 
router.put('/profile', authToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
        res.json({
            status: 'success',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            message: 'User updated successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
}));
exports.UsersRoutes = router;
//# sourceMappingURL=user.js.map