"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editOpportunity = exports.getOpportunityById = exports.getOpportunities = exports.addOpportunity = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const opportunitySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['onsite', 'remote'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: ['new', 'ongoing'],
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true });
// Create and export the model
const Opportunity = mongoose_1.default.model('Opportunity', opportunitySchema);
// Add a new opportunity
const addOpportunity = async (opportunity) => {
    try {
        // Validate price
        if (isNaN(opportunity.price)) {
            throw new Error('Price must be a valid number');
        }
        const newOpportunity = new Opportunity(opportunity);
        await newOpportunity.save();
        console.log('Opportunity added:', newOpportunity);
    }
    catch (error) {
        console.error('Error adding opportunity:', error);
        throw error; // Propagate error for further handling if needed
    }
};
exports.addOpportunity = addOpportunity;
// Get opportunities with filters and pagination
const getOpportunities = async (filters = {}, page = 1, limit = 10) => {
    try {
        let query = {};
        // Filter by category
        if (filters.category) {
            query.category = filters.category;
        }
        if (filters.location) {
            query.location = filters.location; // Assuming `location` is a field in the Opportunity model
        }
        // Filter by price range
        if (!isNaN(filters.minPrice) && !isNaN(filters.maxPrice)) {
            query.price = { $gte: Number(filters.minPrice), $lte: Number(filters.maxPrice) };
        }
        // Filter by condition
        if (filters.condition) {
            query.condition = filters.condition;
        }
        // Pagination setup
        const skip = (page - 1) * limit;
        const opportunities = await Opportunity.find(query)
            .skip(skip)
            .limit(limit);
        return Array.isArray(opportunities) ? opportunities : [];
    }
    catch (error) {
        console.error('Error retrieving opportunities:', error);
        throw error; // Propagate error for further handling if needed
    }
};
exports.getOpportunities = getOpportunities;
// Get an opportunity by ID
const getOpportunityById = async (id) => {
    try {
        // Validate the ID format (MongoDB ObjectId)
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid Opportunity ID format');
        }
        // Find the opportunity by ID
        const opportunity = await Opportunity.findById(id);
        if (!opportunity) {
            throw new Error('Opportunity not found');
        }
        return opportunity;
    }
    catch (error) {
        console.error('Error retrieving opportunity by ID:', error);
        throw error; // Propagate error for further handling if needed
    }
};
exports.getOpportunityById = getOpportunityById;
// Edit an opportunity by ID
const editOpportunity = async (id, updatedData) => {
    try {
        // Validate the ID format (MongoDB ObjectId)
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid Opportunity ID format');
        }
        // Update the opportunity
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true } // Return the updated document and validate fields
        );
        if (!updatedOpportunity) {
            throw new Error('Opportunity not found');
        }
        console.log('Opportunity updated:', updatedOpportunity);
        return updatedOpportunity;
    }
    catch (error) {
        console.error('Error updating opportunity:', error);
        throw error; // Propagate error for further handling if needed
    }
};
exports.editOpportunity = editOpportunity;
//# sourceMappingURL=OpportunityModel.js.map