import api from './api';
import { User } from '../types/user.types';

export const authService = {
  login: async (username: string, password: string) => {
    try {
      // Create a Base64 encoded string of username:password
      const encodedAuth = btoa(`${username}:${password}`);
      const headers = {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      };

      let response;
      
      // Try admin/agency auth first
      try {
        console.log('Attempting admin/agency login...');
        response = await api.get('/agency/auth', { headers });
        console.log('Admin/Agency login response:', response.data);
      } catch (agencyError) {
        console.log('Admin/Agency login failed, trying member login...');
        // If admin/agency login fails, try member login
        response = await api.get('/member/auth', { headers });
        console.log('Member login response:', response.data);
      }

      if (response.data && response.data.role !== undefined) {
        // Store credentials and data from backend
        const userData = {
          ...response.data,
          username,
          password, // Store for Basic Auth
          role: response.data.role
        };
        
        console.log('Storing user data:', { ...userData, username });
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      
      throw new Error('Invalid response: missing role');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      }
      throw new Error('Invalid username or password');
    }
  },
  
  register: async (userData: Partial<User>) => {
    try {
      console.log('Registering user:', userData);
      const endpoint = userData.role === 1 ? '/agency' : '/member';
      const response = await api.post(endpoint, {
        ...userData,
        status: true
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.msg?.includes('registered successfully')) {
        return response.data;
      } else {
        throw new Error(response.data.msg || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error.response?.data);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.status === 409) {
        throw new Error('Username already exists');
      }
      throw new Error('Registration failed. Please check your information and try again.');
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  checkAuth: async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return null;
      }
      
      const user = JSON.parse(userData);
      if (!user.role || !user.username || !user.password) {
        console.error('Invalid user data: missing required fields');
        localStorage.removeItem('user');
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Auth check error:', error);
      return null;
    }
  }
}; 