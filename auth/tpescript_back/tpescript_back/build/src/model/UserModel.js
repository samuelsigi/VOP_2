"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByToken = exports.findUserByEmail = exports.addUser = exports.User = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
// Define the User schema
const userSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
// Create a User model from the schema
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
// Add a user
const addUser = async (userData) => {
    try {
        const user = new User(userData); // Create a new instance of the User model
        await user.save(); // Save the user to MongoDB
        return user;
    }
    catch (error) {
        throw new Error('Error adding user: ' + error.message);
    }
};
exports.addUser = addUser;
// Find user by email
const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email }); // Find user by email
        return user;
    }
    catch (error) {
        throw new Error('Error finding user by email: ' + error.message);
    }
};
exports.findUserByEmail = findUserByEmail;
// Find user by token
const findUserByToken = async (token) => {
    try {
        const user = await User.findOne({ token }); // Find user by token
        return user;
    }
    catch (error) {
        throw new Error('Error finding user by token: ' + error.message);
    }
};
exports.findUserByToken = findUserByToken;
//# sourceMappingURL=UserModel.js.map