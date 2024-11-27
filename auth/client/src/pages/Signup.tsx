import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm'

const Signup: React.FC = () => {
  const navigate = useNavigate();

  // Handle signup logic
  const handleSignup = async (userData: { name: string; email: string; password: string }): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        navigate('/login'); // Redirect to login page
      } else {
        throw new Error('Signup failed.');
      }
    } catch (err) {
      console.error('Error during signup:', err);
      throw err; // Let the form component handle the error
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <SignupForm onSignup={handleSignup} />
    </div>
  );
};

export default Signup;
