import bcrypt from 'bcryptjs';
import { IncomingMessage, ServerResponse } from 'http';
import * as userModel from '../model/UserModel';
import { generateToken, verifyToken } from '../utils/jwt';

const saltRounds = 10;

// Token blacklist for invalidated tokens
let tokenBlacklist: string[] = [];

// Register a new user
const registerUser = async (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { name, email, password } = JSON.parse(body);
  
      const userExists = await userModel.findUserByEmail(email);
      if (userExists) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'User already exists' })); // Explicit return
      }
  
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await userModel.addUser({ name, email, password: hashedPassword });
  
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'User registered successfully' })); // Explicit return
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Server error', error: (err as Error).message }));
    }
  });
  
  
};

// Login user and authenticate
const loginUser = async (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { email, password } = JSON.parse(body);

      // Find user by email
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }

      // Compare password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = generateToken({ email: user.email, id: user._id });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({
            message: 'Login successful!',
            token,
            user: {
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          })
        );
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Server error', error: (err as Error).message }));
    }
  });
};

// Logout user and invalidate token
const logoutUser = (req: IncomingMessage, res: ServerResponse):void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Authorization header missing' }));
    return;
  }

  const token = authHeader.split(' ')[1]; // Extract token
  if (!token) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Token missing' }));
    return;
  }

  // Add token to blacklist
  tokenBlacklist.push(token);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Logout successful' }));
};

// Middleware to check token validity
const authenticateToken = (req: any, res: ServerResponse, next: () => void):void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Authorization header missing' }));
    return;
  }

  const token = authHeader.split(' ')[1];
  if (tokenBlacklist.includes(token)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Token is blacklisted' }));
    return;
  }

  try {
    const user = verifyToken(token);
    req.user = user; // Attach user info to the request
    next();
  } catch (err) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid or expired token' }));
    return;
  }
};

export { registerUser, loginUser, logoutUser, authenticateToken };
