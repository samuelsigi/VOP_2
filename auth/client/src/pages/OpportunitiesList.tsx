import React, { useState, useEffect, ChangeEvent } from 'react';
import './Opportunities.css'; // Import the CSS file
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

interface Opportunity {
  _id: string;
  title: string;
  organization: string;
  location: string;
  duration: string;
  price: string;
  condition: string;
  category: string;
}

interface EditFormState {
  title: string;
  organization: string;
  location: string;
  duration: string;
  price: string;
  condition: string;
  category: string;
}

interface Filters {
  type: string;
  location: string;
}

const OpportunitiesList: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    title: '',
    organization: '',
    location: '',
    duration: '',
    price: '',
    condition: '',
    category: '',
  });
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    type: '',
    location: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 5; // Number of items per page

  // Fetch opportunities from backend
  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      alert('You are not logged in. Please log in.');
      // Optionally, you can navigate using React Router if you are using it
      window.location.href = '/login'; // Redirect to login page
    } else {
      // Fetch opportunities if authenticated
      fetchOpportunities();
    }
  }, [isAuthenticated]);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/opportunities-list', {
        headers: {
          'Authorization': `Bearer ${user?.token}`, // Use the token from auth context
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      } else {
        const errorData = await response.json();
        if (errorData.message.includes('Token has expired')) {
          alert('Your session has expired. Please log in again.');
          logout(); // Call logout if the token has expired
        } else {
          alert('Failed to fetch opportunities.');
        }
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      alert('An error occurred while fetching opportunities.');
    }
  };

  // Pagination logic: Slice the filtered opportunities based on current page and items per page
  const indexOfLastOpportunity = currentPage * itemsPerPage;
  const indexOfFirstOpportunity = indexOfLastOpportunity - itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(
    indexOfFirstOpportunity,
    indexOfLastOpportunity
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Function to delete an opportunity
  const deleteOpportunity = async (id: string) => {
    if (!id) {
      alert('Invalid opportunity ID.');
      return;
    }
  
    const token = sessionStorage.getItem('authToken'); // Retrieve token from sessionStorage
    if (!token) {
      alert('You must be logged in to delete an opportunity.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/auth/opportunities/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setOpportunities((prevOpportunities) =>
          prevOpportunities.filter((opportunity) => opportunity._id !== id)
        );
        alert('Opportunity deleted successfully.');
      } else {
        const errorData = await response.json();
  
        if (errorData.message.includes('Token has expired')) {
          alert('Your session has expired. Please log in again.');
          // Optionally, you can trigger a logout action here to clear the session
          logout(); // If you're using the logout function to clear sessionStorage
          // Redirect user to login page or prompt them to log in again
        } else {
          alert(`Failed to delete opportunity: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      alert('An error occurred while deleting the opportunity.');
    }
  };
  


  // Function to handle editing of an opportunity
  const openEditModal = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setEditForm({
      title: opportunity.title,
      organization: opportunity.organization,
      location: opportunity.location,
      duration: opportunity.duration,
      price: opportunity.price,
      condition: opportunity.condition,
      category: opportunity.category,
    });
    setEditModalOpen(true);
  };

  // Function to handle changes in the edit form fields
  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (!selectedOpportunity) return;
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to update an opportunity.');
      return;
    }
  
    try {
      console.log("sending",token)
      const response = await fetch(
        `http://localhost:5000/api/auth/opportunities/${selectedOpportunity._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(editForm),
        }
      );
  
      if (response.ok) {
        const updatedOpportunity: Opportunity = await response.json();
        setOpportunities((prev) =>
          prev.map((opportunity) =>
            opportunity._id === updatedOpportunity._id ? updatedOpportunity : opportunity
          )
        );
        alert('Opportunity updated successfully.');
        setEditModalOpen(false);
      } else {
        
        const errorData = await response.json();
        if (errorData.message.includes('Token has expired')) {
          console.log(token)
          // alert('Your session has expired. Please log in again.');
          // // Call logout function to clear session
          // logout();  // Make sure the logout function clears the token and updates state
        } else {
          alert('Failed to update opportunity.');
        }
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      alert('An error occurred while updating the opportunity.');
    }
  };
  


  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value, filters.type, filters.location);
  };

  // Handle filter change
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyFilters(searchTerm, updatedFilters.type, updatedFilters.location);
  };

  // Apply search and filters
  const applyFilters = (search: string, type: string, location: string) => {
    let results = opportunities;

    // Apply search filter
    if (search) {
      results = results.filter((opp) =>
        opp.title.toLowerCase().includes(search) ||
        opp.organization.toLowerCase().includes(search)
      );
    }

    // Apply type filter
    if (type) {
      results = results.filter((opp) => opp.category.toLowerCase() === type.toLowerCase());
    }

    // Apply location filter
    if (location) {
      results = results.filter((opp) => opp.location.toLowerCase() === location.toLowerCase());
    }

    setFilteredOpportunities(results);
  };

  return (
    // Component JSX goes here
    <div><Navbar/>
    <div className="opportunities-board-container">
      <br/><br/><br/><br/><br/>
      <h2 className="opportunities-board-title">Available Opportunities</h2>

      {/* Search and Filter Section */}
      <div className="search-and-filter-section">
        <input
          type="text"
          placeholder="Search by title or organization..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input-field"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="filter-by-type-dropdown"
        >
          <option value="">Filter by type</option>
          <option value="Internship">Internship</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Temporary">Temporary</option>
          <option value="Technology">Technology</option>
          <option value="Marketing">Marketing</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Design">Design</option>
        </select>
        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-by-location-dropdown"
        >
          <option value="">Filter by location</option>
          <option value="Los Angeles, CA, USA">Los Angeles</option>
          <option value="San Francisco, USA">San Francisco, USA</option>
          <option value="Remote">Remote</option>
          <option value="Austin, TX, USA">Austin, TX, USA</option>
          <option value="New York, USA">New York, USA</option>
          <option value="London, UK">London, UK</option>
          <option value="Toronto, Canada">Toronto, Canada</option>
          <option value="Sydney, Australia">Sydney, Australia</option>
          <option value="Germany">Germany</option>
        </select>
      </div>

      {/* Display Filtered Opportunities */}
      <div className="opportunity-list-container">
        {currentOpportunities.map((opportunity) => (
          <div className="opportunity-card" key={opportunity._id}>
            <button
              className="opportunity-delete-button"
              onClick={() => deleteOpportunity(opportunity._id)}
            >
              ×
            </button>
            <h3 className="opportunity-title">{opportunity.title}</h3>
            <p className="opportunity-organization">
              <strong>Organization:</strong> {opportunity.organization}
            </p>
            <p className="opportunity-location">
              <strong>Location:</strong> {opportunity.location}
            </p>
            <p className="opportunity-duration">
              <strong>Duration:</strong> {opportunity.duration}
            </p>
            <p className="opportunity-price">
              <strong>Price:</strong> Rs.{opportunity.price}
            </p>
            <p className="opportunity-condition">
              <strong>Condition:</strong> {opportunity.condition}
            </p>
            <p className="opportunity-category">
              <strong>Category:</strong> {opportunity.category}
            </p>
            <button
              className="opportunity-edit-button"
              onClick={() => openEditModal(opportunity)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="pagination-controls">
        <button
          className="pagination-prev-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pagination-page-button ${
              currentPage === index + 1 ? 'active-page' : ''
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="pagination-next-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3 className="edit-modal-title">Edit Opportunity</h3>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditFormChange}
              placeholder="Title"
              className="edit-modal-input"
            />
            <input
              type="text"
              name="organization"
              value={editForm.organization}
              onChange={handleEditFormChange}
              placeholder="Organization"
              className="edit-modal-input"
            />
            <input
              type="text"
              name="location"
              value={editForm.location}
              onChange={handleEditFormChange}
              placeholder="Location"
              className="edit-modal-input"
            />
            <input
              type="text"
              name="duration"
              value={editForm.duration}
              onChange={handleEditFormChange}
              placeholder="Duration"
              className="edit-modal-input"
            />
            <input
              type="number"
              name="price"
              value={editForm.price}
              onChange={handleEditFormChange}
              placeholder="Price"
              className="edit-modal-input"
            />
            <input
              type="text"
              name="condition"
              value={editForm.condition}
              onChange={handleEditFormChange}
              placeholder="Condition"
              className="edit-modal-input"
            />
            <input
              type="text"
              name="category"
              value={editForm.category}
              onChange={handleEditFormChange}
              placeholder="Category"
              className="edit-modal-input"
            />
            <button
              className="edit-modal-save-button"
              onClick={saveChanges}
            >
              Save Changes
            </button>
            <button
              className="edit-modal-cancel-button"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  
  );
};

export default OpportunitiesList;
