import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth(); // Assuming `loading` exists in context
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect unauthenticated users to login, preserving the original route
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;

