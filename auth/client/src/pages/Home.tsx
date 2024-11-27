import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles.css';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const goToLogin = (): void => {
    navigate('/login');
  };

  const goToRegister = (): void => {
    navigate('/register');
  };

  const goToAddOpportunity = (): void => {
    navigate('/opportunities');
  };

  const goToOpportunityList = (): void => {
    navigate('/opportunities-list');
  };


  return (
    <div className="home-container">
      <Navbar/>
      {/* Main Content */}
      <div className="new-type">
        <h2>Welcome to the Opportunities App!</h2>
        {isAuthenticated ? (
          <div>
            <button
              className="add-opportunity-button"
              onClick={goToAddOpportunity}
            >
              Add Opportunity
            </button>
            <button
              className="opportunity-list-button"
              onClick={goToOpportunityList}
            >
              Opportunity List
            </button>
          </div>
        ) : (
          <p>
            <button className="login-button" onClick={goToLogin}>
              Login
            </button>
            <button className="register-button" onClick={goToRegister}>
              Register
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
