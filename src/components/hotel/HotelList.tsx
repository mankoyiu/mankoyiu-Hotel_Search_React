// src/components/hotel/HotelList.tsx
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import HotelCard from './HotelCard';
import { Hotel } from '../../types/hotel.types';
import { favoritesService } from '../../services/favorites.service';
import { useAuth } from '../../contexts/AuthContext';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [favoriteHotelIds, setFavoriteHotelIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  const fetchFavorites = async () => {
    try {
      if (user?.role === 2) {
        const favorites = await favoritesService.getFavorites();
        const validIds = favorites
          .map((hotel: Hotel) => hotel._id)
          .filter((id: string | undefined): id is string => typeof id === 'string');
        setFavoriteHotelIds(new Set(validIds));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        console.log('Fetching hotels from API...');
        const response = await fetch('http://localhost:10888/api/v1/hotel');
        const data = await response.json();
        console.log('Hotels response:', data);
        setHotels(data);
        await fetchFavorites();
      } catch (err: any) {
        console.error('Error fetching hotels:', err);
        setError(err.message || 'Failed to fetch hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [user]);

  const handleFavoriteToggle = async (hotelId: string) => {
    const isFavorite = favoriteHotelIds.has(hotelId);
    
    // Optimistically update UI
    setFavoriteHotelIds(prev => {
      const newSet = new Set(prev);
      if (isFavorite) {
        newSet.delete(hotelId);
      } else {
        newSet.add(hotelId);
      }
      return newSet;
    });

    try {
      // Make API call after updating UI
      if (isFavorite) {
        await favoritesService.removeFavorite(hotelId);
      } else {
        await favoritesService.addFavorite(hotelId);
      }
    } catch (err) {
      // Revert UI state if API call fails
      console.error('Error toggling favorite:', err);
      setFavoriteHotelIds(prev => {
        const newSet = new Set(prev);
        if (isFavorite) {
          newSet.add(hotelId);
        } else {
          newSet.delete(hotelId);
        }
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>
        Available Hotels
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {hotels.map((hotel) => (
          <Box key={hotel._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
            <HotelCard 
              hotel={hotel} 
              isFavorite={favoriteHotelIds.has(hotel._id || '')}
              onFavoriteToggle={() => handleFavoriteToggle(hotel._id || '')}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default HotelList;