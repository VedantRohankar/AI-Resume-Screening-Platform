import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && user) {
    if (user.role?.toLowerCase() === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    }
    return <Navigate to="/candidate" replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicOnlyRoute;
