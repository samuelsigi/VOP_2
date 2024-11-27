import { IncomingMessage, ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { User } from '../model/UserModel'; // Adjust the import as per your file structure
import { JwtPayload } from 'jsonwebtoken';

// This middleware checks if the user is authenticated based on the JWT token in the authorization header.
const isAuthenticated = async (req: IncomingMessage, res: ServerResponse, next: Function): Promise<void> => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Fetch user from the database using the decoded user ID
    const user = await User.findById(decoded.id);

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized: User not found' }));
      return;
    }

    // Attach the user to the request object (if using custom req properties)
    // req['user'] = user;
    
    next();
    return; // Explicitly return to satisfy TypeScript
  } catch (error: any) {
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

export { isAuthenticated };
