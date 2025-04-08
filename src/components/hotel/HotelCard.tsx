// src/components/hotel/HotelCard.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Rating,
  Chip,
  Stack
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Hotel } from '../../types/hotel.types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HotelCardProps {
  hotel: Hotel;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ 
  hotel, 
  isFavorite = false,
  onFavoriteToggle 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  // Update local state when prop changes
  React.useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!loading) {
      setLoading(true);
      try {
        // Update local state immediately
        setLocalFavorite(!localFavorite);
        // Call parent handler
        onFavoriteToggle?.();
      } catch (error: any) {
        console.error('Failed to update favorites:', error);
        // Revert local state on error
        setLocalFavorite(localFavorite);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card elevation={3}>
      <CardMedia
        component="img"
        height="200"
        image={hotel.imageUrl || `https://source.unsplash.com/random/800x600?hotel,${hotel.name}`}
        alt={hotel.name}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h5" component="div">
            {hotel.name}
          </Typography>
          {user?.role === 2 && (
            <IconButton 
              onClick={handleFavoriteClick}
              disabled={loading}
              color={localFavorite ? "error" : "default"}
            >
              {localFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}
        </Box>
        <Rating value={hotel.star} readOnly precision={0.5} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {hotel.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {hotel.address}, {hotel.city}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {Array.isArray(hotel.facilities) && hotel.facilities.length > 0 
            ? hotel.facilities.slice(0, 3).map((facility, index) => (
                <Chip key={index} label={facility} size="small" />
              ))
            : <Typography variant="caption" color="text.secondary">No facilities listed</Typography>
          }
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HotelCard;