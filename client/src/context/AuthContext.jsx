import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * Safely decodes a JWT payload without external libraries
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const jwtPayload = parseJwt(storedToken);

          // If JWT has role, ensure user.role matches
          if (jwtPayload?.role && !parsedUser.role) {
            parsedUser.role = jwtPayload.role;
          }

          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Failed to parse stored auth session:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for 401 session expiration from api.js interceptor
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('hireai:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('hireai:auth-expired', handleAuthExpired);
  }, []);

  // Login handler
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const data = await loginUser(credentials);
      const authToken = data.token;
      const decoded = parseJwt(authToken);
      
      const authUser = {
        id: data.user?.id || decoded?.id || 'usr-' + Date.now(),
        username: data.user?.username || credentials.email.split('@')[0],
        email: data.user?.email || credentials.email,
        role: data.user?.role || decoded?.role || (credentials.email.includes('recruiter') ? 'recruiter' : 'candidate'),
      };

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));

      setToken(authToken);
      setUser(authUser);
      return { success: true, user: authUser, message: data.message };
    } catch (error) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || error.message || 'Login failed. Please check credentials.';
      return { success: false, message, status: statusCode, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register handler
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      return { success: true, data, message: data.message };
    } catch (error) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      return { success: false, message, status: statusCode, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fast Demo Login (for evaluators & seamless live testing)
  const loginDemo = useCallback((role = 'recruiter') => {
    const isRecruiterRole = role === 'recruiter';
    const demoUser = {
      id: isRecruiterRole ? 'rec-demo-88' : 'cand-demo-99',
      username: isRecruiterRole ? 'Sarah (Recruiter)' : 'Alex Morgan',
      email: isRecruiterRole ? 'recruiter.demo@hireai.dev' : 'alex.candidate@hireai.dev',
      role: isRecruiterRole ? 'recruiter' : 'candidate',
      isDemo: true,
    };
    const demoToken = `mock-demo-jwt-token-${Date.now()}`;

    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));

    setToken(demoToken);
    setUser(demoUser);
    return demoUser;
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Update user profile info
  const updateUser = useCallback((newUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    isCandidate: user?.role === 'candidate',
    isRecruiter: user?.role === 'recruiter',
    login,
    register,
    loginDemo,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;