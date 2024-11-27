import { IncomingMessage, ServerResponse } from 'http';
import { URLSearchParams } from 'url';
import mongoose from 'mongoose';
import * as OpportunityModel from '../model/OpportunityModel';

// List opportunities with filters and pagination
const listOpportunities = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1] ?? '');
  const filters = {
    category: urlParams.get('category') || '',
    minPrice: parseInt(urlParams.get('minPrice') || '0', 10),
    maxPrice: parseInt(urlParams.get('maxPrice') || 'Infinity', 10),
    condition: urlParams.get('condition') || ''
  };

  const page = parseInt(urlParams.get('page') || '1', 10);
  const limit = parseInt(urlParams.get('limit') || '10', 10);

  try {
    const opportunities = await OpportunityModel.getOpportunities(filters, page, limit);
    
    if (Array.isArray(opportunities)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(opportunities));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid data format: opportunities should be an array.', error: 'Invalid data' }));
    }
  } catch (error: any) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Error retrieving opportunities', error: error.message }));
  }
};

// Create a new opportunity
const createOpportunity = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  let body = '';

  // Collect the body data from the request
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const opportunityData = JSON.parse(body);
      const { title, organization, location, duration, type, price, condition, category } = opportunityData;
  
      // Validate required fields
      if (
        !title?.trim() ||
        !organization?.trim() ||
        !location?.trim() ||
        !duration?.trim() ||
        !type?.trim() ||
        !price?.trim() ||
        !condition?.trim() ||
        !category?.trim()
      ) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Missing or invalid required fields' })); // Explicit return
      }
  
      // Save the opportunity (assuming `addOpportunity` is implemented in your model)
      await OpportunityModel.addOpportunity(opportunityData);
  
      // Send success response
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Opportunity created successfully' })); // Explicit return
    } catch (error: any) {
      // Handle unexpected errors
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        message: 'Server error', 
        error: error.message 
      })); // Explicit return
    }
  });
  
  req.on('error', (error: any) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Request error', error: error.message }));
  });
};

// Remove an opportunity by ID
const removeOpportunity = async (res: ServerResponse, opportunityId: string): Promise<void> => {
  // Check for valid opportunityId
  if (!opportunityId) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Opportunity ID is required' }));
    return;  // Return after handling the response
  }

  // Check for valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid Opportunity ID format' }));
    return;  // Return after handling the response
  }

  try {
    // Fetch opportunity by ID
    const opportunity = await OpportunityModel.getOpportunityById(opportunityId);

    if (!opportunity) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Opportunity not found' }));
      return;  // Return after handling the response
    }

    // Delete the opportunity
    await opportunity.deleteOne();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Opportunity deleted successfully' }));
  } catch (error: any) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Error deleting opportunity', error: error.message }));
  }
};

// Edit an existing opportunity by ID
const editOpportunity = async (req: IncomingMessage, res: ServerResponse, opportunityId: string): Promise<void> => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const updatedData = JSON.parse(body);

      // Validate opportunityId existence
      if (!opportunityId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Opportunity ID is required' })); // Explicit return
      }

      // Validate opportunityId format
      if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid Opportunity ID format' })); // Explicit return
      }

      // Update the opportunity in the database
      const updatedOpportunity = await OpportunityModel.editOpportunity(opportunityId, updatedData);

      // Send success response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Opportunity updated successfully', data: updatedOpportunity })); // Explicit return
    } catch (error: any) {
      // Handle any unexpected errors
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        message: 'Error updating opportunity', 
        error: error.message 
      })); // Explicit return
    }
  });

};

export {
  listOpportunities,
  createOpportunity,
  removeOpportunity,
  editOpportunity
};
