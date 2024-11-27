import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddOpportunityForm from '../components/AddOpportunityForm';
import './Opportunities.css';
import Navbar from '../components/Navbar';

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

const AddOpportunity = () => {
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: '',
    organization: '',
    location: '',
    duration: '',
    type: 'onsite',
    price: '',
    condition: 'new',
    category: ''
  });

  const { user } = useAuth(); // Access user with token from context
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.token) {
      alert('User is not authenticated.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Use the token from AuthContext
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Opportunity added successfully!');
        setFormData({
          title: '',
          organization: '',
          location: '',
          duration: '',
          type: 'onsite',
          price: '',
          condition: 'new',
          category: ''
        });
        navigate('/'); // Redirect to home page
      } else {
        const errorData = await response.json();
        alert(`Failed to add opportunity: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the opportunity');
    }
  };
  return (
  <div>
    <Navbar/>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <AddOpportunityForm 
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  </div>
    
  );
  

};

export default AddOpportunity;


