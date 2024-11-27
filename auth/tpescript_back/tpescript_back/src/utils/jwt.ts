// utils/jwt.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const secretKey: string | undefined = process.env.JWT_SECRET;

// Type definition for the payload
interface Payload {
  [key: string]: any; // Can be more specific depending on your payload structure
}

// Generate JWT token
const generateToken = (payload: Payload): string => {
  if (!secretKey) {
    throw new Error('JWT secret key is missing');
  }
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Verify JWT token
const verifyToken = (token: string): JwtPayload | null => {
  if (!secretKey) {
    throw new Error('JWT secret key is missing');
  }

  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    return null;
  }
};

export { generateToken, verifyToken };
