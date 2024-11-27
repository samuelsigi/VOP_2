"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
// Load environment variables from .env
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI); // No need for additional options
        console.log('MongoDB connected successfully');
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('MongoDB connection error:', err.message);
        }
        else {
            console.error('Unknown MongoDB connection error:', err);
        }
        process.exit(1); // Exit the application if the connection fails
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map