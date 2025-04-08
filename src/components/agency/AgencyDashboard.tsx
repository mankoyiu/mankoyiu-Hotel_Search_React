// src/components/agency/AgencyDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hotelService } from '../../services/hotel.service';
import { agencyService } from '../../services/agency.service';
import { Hotel } from '../../types/hotel.types';
import HotelCard from '../hotel/HotelCard';
import PhotoUpload from './PhotoUpload';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

interface Photo {
  _id: string;
  url: string;
  filename: string;
  uploadDate: string;
}

const AgencyDashboard: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching hotels...');
      const response = await hotelService.getHotels();
      console.log('Hotels response:', response);
      
      // Check if response and response.data exist before filtering
      if (response && response.data) {
        const hotels = Array.isArray(response.data) ? response.data : [response.data];
        // Filter hotels for the current agency using the agency ID from the user context
        const agencyHotels = hotels.filter((hotel: Hotel) => {
          console.log('Comparing hotel.agencyId:', hotel.agencyId, 'with user.id:', user?.id);
          return hotel.agencyId === user?.id;
        });
        console.log('Filtered hotels:', agencyHotels);
        setHotels(agencyHotels);
      } else {
        console.log('No hotels data received');
        setHotels([]);
      }

      console.log('Fetching photos...');
      try {
        const photosResponse = await agencyService.getPhotos();
        console.log('Photos response:', photosResponse);
        
        // Process photos directly since getPhotos already returns the data
        if (photosResponse && Array.isArray(photosResponse)) {
          console.log('Processing photos:', photosResponse);
          const sortedPhotos = photosResponse.sort((a: any, b: any) => {
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
          });
          // Transform the URLs to use the correct base URL and photo ID
          const processedPhotos = sortedPhotos.map((photo: any) => ({
            ...photo,
            url: photo.url || `http://localhost:10888/api/v1/agency/photos/${photo._id}`
          }));
          setPhotos(processedPhotos);
        } else {
          console.log('No photos found or invalid response format');
          setPhotos([]);
        }
      } catch (photoError: any) {
        console.error('Error fetching photos:', photoError);
        // Don't set error state for photo fetch failures, just log it
        setPhotos([]);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        console.log('Authentication error, redirecting to login');
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to fetch data');
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handlePhotoUpload = () => {
    navigate('/agency/photo-upload');
  };

  const handleAddHotel = () => {
    navigate('/add-hotel');
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="warning">Please log in to view the agency dashboard.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Agency Dashboard
      </Typography>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <Paper 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            flex: 1 
          }}
        >
          <AddBusinessIcon sx={{ fontSize: 40 }} />
          <Typography variant="h6">Manage Hotels</Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddHotel}
          >
            Add New Hotel
          </Button>
        </Paper>
        
        <Paper 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            flex: 1 
          }}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
          <Typography variant="h6">Manage Photos</Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePhotoUpload}
          >
            Upload Photos
          </Button>
        </Paper>
      </Stack>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Agency Photos
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {photos.length > 0 ? (
          <ImageList sx={{ width: '100%', height: 450 }} cols={3} rowHeight={200}>
            {photos.map((photo) => (
              <ImageListItem key={photo._id}>
                <img
                  src={photo.url}
                  alt={photo.filename}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Error loading image:', photo.url);
                    e.currentTarget.src = 'https://via.placeholder.com/200?text=Error+Loading+Image';
                    e.currentTarget.onerror = null; // Prevent infinite loop
                  }}
                />
                <ImageListItemBar
                  title={photo.filename}
                  subtitle={new Date(photo.uploadDate).toLocaleDateString()}
                  actionIcon={
                    <IconButton
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label="delete photo"
                      onClick={() => {
                        // TODO: Implement photo deletion
                        console.log('Delete photo:', photo._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Alert severity="info">No photos uploaded yet.</Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            My Hotels
          </Typography>
        </Box>
        
        {hotels.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {hotels.map((hotel) => (
              <Box key={hotel._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                <HotelCard hotel={hotel} />
              </Box>
            ))}
          </Box>
        ) : (
          <Alert severity="info">No hotels added yet.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default AgencyDashboard;
