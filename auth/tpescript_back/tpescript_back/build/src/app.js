"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const authController = tslib_1.__importStar(require("./controller/AuthController"));
const opportunityController = tslib_1.__importStar(require("./controller/OpportunityController"));
const AuthMiddleware_1 = require("./middleware/AuthMiddleware");
const db_1 = tslib_1.__importDefault(require("./config/db")); // Import the db.ts
// Connect to the database
(0, db_1.default)(); // Establish MongoDB connection
// Create server
http_1.default.createServer((req, res) => {
    // Set headers for CORS and content type
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/json'); // Set response header for JSON response
    // Handle OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content
        res.end();
        return;
    }
    // Register route
    if (req.method === 'POST' && req.url === '/api/auth/register') {
        authController.registerUser(req, res);
    }
    // Login route
    else if (req.method === 'POST' && req.url === '/api/auth/login') {
        authController.loginUser(req, res);
    }
    // Protected opportunity creation route
    else if (req.method === 'POST' && req.url === '/api/auth/opportunities') {
        (0, AuthMiddleware_1.isAuthenticated)(req, res, () => {
            opportunityController.createOpportunity(req, res);
        });
    }
    // Opportunity list route
    else if (req.method === 'GET' && req.url?.startsWith('/api/opportunities-list')) {
        opportunityController.listOpportunities(req, res);
    }
    // Delete opportunity route
    else if (req.method === 'DELETE' && req.url?.startsWith('/api/auth/opportunities')) {
        (0, AuthMiddleware_1.isAuthenticated)(req, res, () => {
            const id = req.url?.split('/').pop(); // Extract opportunity ID from the URL
            if (id)
                opportunityController.removeOpportunity(res, id);
        });
    }
    // Edit opportunity route
    else if (req.method === 'PUT' && req.url?.startsWith('/api/auth/opportunities')) {
        (0, AuthMiddleware_1.isAuthenticated)(req, res, () => {
            const opportunityId = req.url?.split('/').pop(); // Extract opportunity ID from the URL
            if (opportunityId)
                opportunityController.editOpportunity(req, res, opportunityId);
        });
    }
    // Handle 404 Not Found
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
}).listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
//# sourceMappingURL=app.js.map