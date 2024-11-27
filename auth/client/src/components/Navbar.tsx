// Navbar.tsx
import React from 'react';
import {  useAuth } from '../context/AuthContext';  // Adjust the path based on your project structure
import BackButton from '../components/back';
const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();  // Access authentication state and logout function from context

  const handleLogout = () => {
    logout();  // Log the user out when the logout button is clicked
  
  };

  return (
    <div className="home-container">
      {/* Conditionally Render Navbar based on Authentication Status */}
      {isAuthenticated && (
        <nav className="navbar">
          <div className="navbar-container">
            <h1 className="navbar-title">Opportunities</h1>
            <button className="navbar-logout-button" onClick={handleLogout}>
              Logout
            </button>
            <div ><BackButton/></div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;

