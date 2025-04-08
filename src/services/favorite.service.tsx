// src/services/favorite.service.tsx
import api from './api';
import { Hotel } from '../types/hotel.types';

export const favoriteService = {
  getFavorites: async (token: string, username: string) => {
    try {
      const response = await api.get(`/favorites/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  addToFavorites: async (token: string, hotelId: string) => {
    try {
      const response = await api.post('/favorites', 
        { hotelId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  removeFromFavorites: async (token: string, hotelId: string) => {
    try {
      const response = await api.delete(`/favorites/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }
};