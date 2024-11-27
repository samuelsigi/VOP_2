"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const tslib_1 = require("tslib");
// utils/jwt.ts
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const secretKey = process.env.JWT_SECRET;
// Generate JWT token
const generateToken = (payload) => {
    if (!secretKey) {
        throw new Error('JWT secret key is missing');
    }
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
// Verify JWT token
const verifyToken = (token) => {
    if (!secretKey) {
        throw new Error('JWT secret key is missing');
    }
    try {
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (err) {
        return null;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map