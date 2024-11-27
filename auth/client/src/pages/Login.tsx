import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    login(token);
    alert('Login successful');
    navigate('/'); // Redirect to homepage or dashboard
  };

 

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {!isAuthenticated ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <p>Welcome! You are logged in.</p>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
