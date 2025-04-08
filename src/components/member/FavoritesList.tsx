// src/components/member/FavoritesList.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { favoritesService } from '../../services/favorites.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  price: number;
}

const FavoritesList: React.FC = () => {
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching favorites with user:', user);
      const data = await favoritesService.getFavorites();
      console.log('Favorites data:', data);
      setFavorites(data);
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setError(err.message || 'Failed to fetch favorites');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const handleRemoveFavorite = async (hotelId: string) => {
    try {
      await favoritesService.removeFavorite(hotelId);
      setFavorites(favorites.filter(hotel => hotel._id !== hotelId));
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to remove from favorites');
      }
    }
  };

  const handleViewDetails = (hotelId: string) => {
    navigate(`/hotels/${hotelId}`);
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="warning">Please log in to view your favorites.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Favorite Hotels
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {favorites.length === 0 ? (
        <Alert severity="info">
          You haven't added any hotels to your favorites yet.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={hotel.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={hotel.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {hotel.location}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${hotel.price}/night
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(hotel._id)}
                    >
                      View Details
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => handleRemoveFavorite(hotel._id)}
                      aria-label="remove from favorites"
                    >
                      <Favorite />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesList;