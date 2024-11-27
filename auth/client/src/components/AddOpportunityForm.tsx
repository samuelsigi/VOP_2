// AddOpportunityForm.tsx

import React, { ChangeEvent } from 'react';

// Define types for the form data
interface OpportunityFormData {
  title: string;
  organization: string;
  location: string;
  duration: string;
  type: 'onsite' | 'remote';
  price: string;
  condition: 'new' | 'ongoing';
  category: string;
}

interface AddOpportunityFormProps {
  formData: OpportunityFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ formData, handleChange, handleSubmit }) => {
  return (
  
    <form onSubmit={handleSubmit}>
      <h3>Add New Opportunity</h3>
      <label>Title:</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label>Organization:</label>
      <input type="text" name="organization" value={formData.organization} onChange={handleChange} required />

      <label>Location:</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} required />

      <label>Duration:</label>
      <input type="text" name="duration" value={formData.duration} onChange={handleChange} />

      <label>Type:</label>
      <select name="type" value={formData.type} onChange={handleChange} required>
        <option value="onsite">Onsite</option>
        <option value="remote">Remote</option>
      </select>

      <label>Price:</label>
      <input type="number" name="price" value={formData.price} onChange={handleChange} required />

      <label>Condition:</label>
      <select name="condition" value={formData.condition} onChange={handleChange} required>
        <option value="new">New</option>
        <option value="ongoing">Ongoing</option>
      </select>

      <label>Category:</label>
      <input type="text" name="category" value={formData.category} onChange={handleChange} required />
      
      <div className="form-button">
        <button type="submit">Add Opportunity</button>
      </div>
    </form>
  );
};

export default AddOpportunityForm;
