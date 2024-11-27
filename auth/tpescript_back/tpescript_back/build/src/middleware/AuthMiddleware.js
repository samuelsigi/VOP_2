"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const UserModel_1 = require("../model/UserModel"); // Adjust the import as per your file structure
// This middleware checks if the user is authenticated based on the JWT token in the authorization header.
const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Authheader:', authHeader);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized: No or invalid token provided' }));
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Fetch user from the database using the decoded user ID
        const user = await UserModel_1.User.findById(decoded.id);
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized: User not found' }));
            return;
        }
        // Attach the user to the request object (if using custom req properties)
        // req['user'] = user;
        next();
        return; // Explicitly return to satisfy TypeScript
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized: Token has expired' }));
            return;
        }
        console.error('Error in authentication middleware:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
        return;
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=AuthMiddleware.js.map