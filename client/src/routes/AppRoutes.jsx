import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import CandidateDashboard from '../pages/CandidateDashboard.jsx';
import RecruiterDashboard from '../pages/RecruiterDashboard.jsx';
import NotFound from '../pages/NotFound.jsx';

// Route Guards
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import PublicOnlyRoute from './PublicOnlyRoute.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Verification & Password Reset Flows */}
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public Only Auth Pages (Redirects logged-in users to their dashboard) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Candidate Protected Portal */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['candidate']}>
              <CandidateDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Recruiter Protected Hub */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
