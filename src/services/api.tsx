// src/services/api.ts
import axios from 'axios';

// Update the API URL to point to the correct backend system
const API_URL = 'http://localhost:10888/api/v1';

console.log('API URL:', API_URL); // Debug log to check what URL is being used

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`${config.method?.toUpperCase()} request to ${config.url}`);
    
    // Skip auth only for registration and login endpoints
    if (config.url?.includes('/auth') && config.method === 'get') {
      return config;
    }
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.username && user.password) {
        const encodedAuth = btoa(`${user.username}:${user.password}`);
        config.headers['Authorization'] = `Basic ${encodedAuth}`;
        console.log('Added Basic Auth header');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response ${response.status} from ${response.config.url}`);
    
    // If this is a successful login response, store the token
    if (response.config.url?.includes('/auth') && response.data?.token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.token = response.data.token;
        console.log('Storing token from login response:', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Only redirect to login if it's a 401 error AND we're not already on the login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      console.log('Authentication error, but not redirecting automatically');
      // Don't automatically redirect or clear user data
      // Let the component handle the error appropriately
    }
    
    return Promise.reject(error);
  }
);

export default api;
