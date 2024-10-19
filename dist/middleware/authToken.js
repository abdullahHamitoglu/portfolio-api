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
exports.authenticateToken = exports.secretKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../database/models/user.model"));
exports.secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDIyMTUyNywiaWF0IjoxNzE0MjIxNTI3fQ.s3yQikiTmhhHHh2QKiozLT8RswK0LATLVZ2ktfTkfhs";
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            status: 'error',
            data: null,
            message: 'Authorization header missing'
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Token missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, exports.secretKey);
        const user = yield user_model_1.default.findById(decoded.userId);
        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({
            status: 'error',
            data: null,
            message: 'Invalid token'
        });
    }
});
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=authToken.js.map