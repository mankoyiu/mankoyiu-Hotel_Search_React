// src/services/message.service.ts
import axios from 'axios';

const API_URL = 'http://localhost:10888/api/v1';

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
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Error getting auth header:', error);
    return null;
  }
};

export const messageService = {
  getMessages: async () => {
    try {
      const headers = getAuthHeader();
      if (!headers) {
        console.error('Failed to get auth headers');
        throw new Error('Not authenticated');
      }

      console.log('Fetching messages with headers:', headers);
      const response = await axios.get(
        `${API_URL}/message`,
        { headers }
      );
      console.log('Messages response:', response.data);
      return response.data?.data || [];
    } catch (error: any) {
      console.error('Error fetching messages:', error.response || error);
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        throw new Error('Not authenticated');
      }
      if (error.response?.status === 500) {
        console.error('Server error details:', error.response.data);
        throw new Error('Server error while fetching messages. Please try again.');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch messages');
    }
  },

  sendMessage: async (content: string, receiver: string) => {
    try {
      const headers = getAuthHeader();
      if (!headers) {
        throw new Error('Not authenticated');
      }

      const response = await axios.post(
        `${API_URL}/message`,
        {
          receiver,
          content,
          type: 'text'
        },
        { headers }
      );
      return response.data?.data;
    } catch (error: any) {
      console.error('Error sending message:', error.response || error);
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        throw new Error('Not authenticated');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to send message');
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const headers = getAuthHeader();
      if (!headers) {
        throw new Error('Not authenticated');
      }

      const response = await axios.delete(
        `${API_URL}/message`,
        { 
          headers,
          data: { messageId }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error deleting message:', error.response || error);
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        throw new Error('Not authenticated');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete message');
    }
  }
};