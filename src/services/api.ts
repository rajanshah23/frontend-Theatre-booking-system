import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust base URL to your backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include JWT token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
