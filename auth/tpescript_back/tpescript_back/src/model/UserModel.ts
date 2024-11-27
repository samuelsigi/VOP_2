import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the User schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Create a User model from the schema
const User = mongoose.model<IUser>('User', userSchema);

// Add a user
const addUser = async (userData: { name?: string; email: string; password: string }): Promise<IUser> => {
  try {
    const user = new User(userData); // Create a new instance of the User model
    await user.save(); // Save the user to MongoDB
    return user;
  } catch (error: any) {
    throw new Error('Error adding user: ' + error.message);
  }
};

// Find user by email
const findUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await User.findOne({ email }); // Find user by email
    return user;
  } catch (error: any) {
    throw new Error('Error finding user by email: ' + error.message);
  }
};

// Find user by token
const findUserByToken = async (token: string): Promise<IUser | null> => {
  try {
    const user = await User.findOne({ token }); // Find user by token
    return user;
  } catch (error: any) {
    throw new Error('Error finding user by token: ' + error.message);
  }
};

export {
  User,
  addUser,
  findUserByEmail,
  findUserByToken,
};
