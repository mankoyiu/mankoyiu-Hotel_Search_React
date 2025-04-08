import axios from 'axios';
import api from './api';

interface AgencyService {
  uploadPhoto: (file: File) => Promise<any>;
  getAgencyInfo: () => Promise<any>;
  updateAgencyInfo: (agencyData: any) => Promise<any>;
  getPhotos: () => Promise<any>;
}

const getAuthHeader = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) {
      console.error('No user found in localStorage');
      return null;
    }
    
    const userData = JSON.parse(user);
    if (!userData.username || !userData.password) {
      console.error('No credentials found in user data');
      return null;
    }
    
    // Create Basic Auth token from username and password
    const token = btoa(`${userData.username}:${userData.password}`);
    return {
      'Authorization': `Basic ${token}`
    };
  } catch (error) {
    console.error('Error getting auth header:', error);
    return null;
  }
};

export const agencyService: AgencyService = {
  uploadPhoto: async (file: File) => {
    try {
      const headers = getAuthHeader();
      if (!headers) {
        throw new Error('Not authenticated');
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading photo with headers:', headers);
      console.log('FormData contents:', formData.get('file'));
      
      const response = await api.post(
        '/agency/upload-photo',
        formData,
        {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error uploading photo:', error.response || error);
      if (error.response?.status === 401) {
        throw new Error('Not authenticated');
      }
      if (error.response?.status === 500) {
        console.error('Server error details:', error.response.data);
        throw new Error('Server error while uploading photo. Please try again.');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload photo');
    }
  },

  getAgencyInfo: async () => {
    try {
      const headers = getAuthHeader();
      if (!headers) {
        throw new Error('Not authenticated');
      }
      const response = await api.get('/agency/info');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAgencyInfo: async (agencyData: any) => {
    try {
      const headers = getAuthHeader();
      if (!headers) {
        throw new Error('Not authenticated');
      }
      const response = await api.put('/agency/info', agencyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPhotos: async () => {
    try {
      const headers = getAuthHeader();
      if (!headers) {
        throw new Error('Not authenticated');
      }

      console.log('Fetching photos with headers:', headers);
      const response = await api.get('/agency/get-photos');
      console.log('Photos response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching photos:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      if (error.response?.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch photos');
    }
  }
};

export default agencyService; 