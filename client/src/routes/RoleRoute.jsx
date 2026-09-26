import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toLowerCase();
  const hasAccess = allowedRoles.map((r) => r.toLowerCase()).includes(userRole);

  if (!hasAccess) {
    // Route to user's authorized dashboard
    if (userRole === 'candidate') {
      return <Navigate to="/candidate" replace />;
    } else if (userRole === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
