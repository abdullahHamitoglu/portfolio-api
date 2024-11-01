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
const User_1 = __importDefault(require("../database/models/User"));
exports.secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDIyMTUyNywiaWF0IjoxNzE0MjIxNTI3fQ.s3yQikiTmhhHHh2QKiozLT8RswK0LATLVZ2ktfTkfhs";
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    // Check if authorization header is missing
    if (!authHeader) {
        res.status(401).json({
            status: 'error',
            data: null,
            message: 'Authorization header missing'
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    // Check if token is missing
    if (!token) {
        res.status(401).json({ error: 'Token missing' });
        return;
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, exports.secretKey);
        // Fetch user data
        const user = yield User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null
            });
            return;
        }
        // Attach user data to req object and continue to next handler
        req.user = user;
        next(); // Proceed to the next middleware/route handler
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