// src/services/hotel.service.ts
import api from './api';
import { Hotel } from '../types/hotel.types';

export const hotelService = {
  getHotels: async () => {
    try {
      console.log('Calling getHotels() with API URL:', api.defaults.baseURL);
      const response = await api.get('/hotel');
      console.log('Hotel response:', response);
      return response;
    } catch (error) {
      console.error('Error in getHotels():', error);
      throw error;
    }
  },

  createHotel: async (hotelData: Partial<Hotel>) => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Authentication required');
      }
      const response = await api.post('/hotel', hotelData);
      return response.data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  },

  updateHotel: async (id: string, hotelData: Hotel) => {
    const response = await api.put(`/hotel/${id}`, hotelData);
    return response.data;
  },

  deleteHotel: async (id: string, token: string) => {
    const response = await api.delete(`/hotel/${id}`);
    return response.data;
  }
};