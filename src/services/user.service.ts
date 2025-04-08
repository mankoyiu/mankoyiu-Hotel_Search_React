import api from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  name: {
    firstname: string;
    lastname: string;
    middlename?: string;
    nickname: string;
  };
  status: boolean;
  role: number;
  profilePhoto?: string;
}

export const userService = {
  getAllUsers: async () => {
    try {
      console.log('Fetching users from API...');
      const response = await api.get('/user');
      console.log('API Response:', response);
      
      if (response.data) {
        // Check if the response has the expected format with success, count, and users properties
        if (response.data.success && response.data.users && Array.isArray(response.data.users)) {
          console.log('Users data (from users array):', response.data.users);
          return response.data.users;
        }
        // If the data is directly an array, return it
        else if (Array.isArray(response.data)) {
          console.log('Users data (array):', response.data);
          return response.data;
        }
        // If the data is nested in a property (e.g., response.data.users)
        else {
          const dataKeys = Object.keys(response.data);
          if (dataKeys.length > 0) {
            const firstKey = dataKeys[0];
            if (Array.isArray(response.data[firstKey])) {
              console.log('Users data (nested):', response.data[firstKey]);
              return response.data[firstKey];
            }
          }
        }
      }
      
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from server');
    } catch (error: any) {
      console.error('Error fetching users:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to fetch users');
      }
      throw error;
    }
  },

  updateUser: async (username: string, userData: Partial<User>) => {
    try {
      console.log('Updating user:', username, userData);
      const response = await api.put(`/user/${username}`, userData);
      console.log('Update response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update user');
      }
      throw error;
    }
  },

  deleteUser: async (username: string) => {
    try {
      console.log('Deleting user:', username);
      const response = await api.delete(`/user/${username}`);
      console.log('Delete response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to delete user');
      }
      throw error;
    }
  },

  changeUserStatus: async (username: string, status: boolean) => {
    try {
      console.log('Changing user status:', username, status);
      const response = await api.put(`/user/${username}/status`, { status });
      console.log('Status change response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error changing user status:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to change user status');
      }
      throw error;
    }
  }
}; 