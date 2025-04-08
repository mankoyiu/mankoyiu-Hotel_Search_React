import api from './api';

export const favoritesService = {
  getFavorites: async () => {
    try {
      console.log('Fetching favorites...');
      const response = await api.get('/favourlist');
      console.log('Favorites response:', response.data);
      return response.data?.data || [];
    } catch (error: any) {
      console.error('Error fetching favorites:', error.response || error);
      throw error;
    }
  },

  addFavorite: async (hotelId: string) => {
    try {
      console.log('Adding hotel to favorites:', hotelId);
      const response = await api.post('/favourlist', { hotelId });
      console.log('Add favorite response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error adding favorite:', error.response || error);
      throw error;
    }
  },

  removeFavorite: async (hotelId: string) => {
    try {
      console.log('Removing hotel from favorites:', hotelId);
      const response = await api.delete('/favourlist', {
        data: { hotelId }
      });
      console.log('Remove favorite response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error removing favorite:', error.response || error);
      throw error;
    }
  }
}; 