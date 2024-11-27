import http, { IncomingMessage, ServerResponse } from 'http';
import * as authController from './controller/AuthController';
import * as opportunityController from './controller/OpportunityController';
import { isAuthenticated } from './middleware/AuthMiddleware';
import connectDB from './config/db'; // Import the db.ts

// Connect to the database
connectDB(); // Establish MongoDB connection

// Create server
http.createServer((req: IncomingMessage, res: ServerResponse) => {
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
    isAuthenticated(req, res, () => {
      opportunityController.createOpportunity(req, res);
    });
  } 
  // Opportunity list route
  else if (req.method === 'GET' && req.url?.startsWith('/api/opportunities-list')) {
    opportunityController.listOpportunities(req, res);
  } 
  // Delete opportunity route
  else if (req.method === 'DELETE' && req.url?.startsWith('/api/auth/opportunities')) {
    isAuthenticated(req, res, () => {
      const id = req.url?.split('/').pop(); // Extract opportunity ID from the URL
      if (id) opportunityController.removeOpportunity(res, id);
    });
  } 
  // Edit opportunity route
  else if (req.method === 'PUT' && req.url?.startsWith('/api/auth/opportunities')) {
    isAuthenticated(req, res, () => {
      const opportunityId = req.url?.split('/').pop(); // Extract opportunity ID from the URL
      if (opportunityId) opportunityController.editOpportunity(req, res, opportunityId);
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
