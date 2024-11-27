import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string); // No need for additional options
    console.log('MongoDB connected successfully');
  } catch (err) {
    if (err instanceof Error) {
      console.error('MongoDB connection error:', err.message);
    } else {
      console.error('Unknown MongoDB connection error:', err);
    }
    process.exit(1); // Exit the application if the connection fails
  }
};

export default connectDB;
