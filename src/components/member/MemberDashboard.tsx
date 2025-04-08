// src/components/member/MemberDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { agencyService } from '../../services/agency.service';

interface Photo {
  _id: string;
  url: string;
  filename: string;
  uploadDate: string;
}

const MemberDashboard: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching data with user:', user);

      const photosResponse = await agencyService.getPhotos();
      console.log('Photos response:', photosResponse);
      setPhotos(photosResponse);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'Failed to fetch data');
      if (err.message === 'Not authenticated') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handlePhotoUpload = () => {
    navigate('/member/photo-upload');
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="warning">Please log in to view the member dashboard.</Alert>
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
        Member Dashboard
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
          Member Photos
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
    </Box>
  );
};

export default MemberDashboard;