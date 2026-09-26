import axios from "axios";

// Clean up baseURL to prevent leading/trailing whitespace or undefined errors
const rawBaseUrl = import.meta.env.VITE_API_URL;
const baseURL = (rawBaseUrl && rawBaseUrl.trim()) 
  ? rawBaseUrl.trim() 
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors and unauthorized (401)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized, unless it's a login attempt
      const isAuthPath = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
      if (!isAuthPath) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Dispatch custom event so AuthContext can update state without hard reload
        window.dispatchEvent(new CustomEvent("hireai:auth-expired"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;