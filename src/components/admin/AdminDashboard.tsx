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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hotelService } from '../../services/hotel.service';
import { agencyService } from '../../services/agency.service';
import HotelCard from '../hotel/HotelCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const AdminDashboard: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching data with user:', user);

      const hotelsResponse = await hotelService.getHotels();
      console.log('All hotels:', hotelsResponse);
      setHotels(hotelsResponse);
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

  const handleAddHotel = () => {
    navigate('/add-hotel');
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="warning">Please log in to view the admin dashboard.</Alert>
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
        Admin Dashboard
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
          <SupervisorAccountIcon sx={{ fontSize: 40 }} />
          <Typography variant="h6">Manage Users</Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleManageUsers}
          >
            Manage Users
          </Button>
        </Paper>
      </Stack>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            All Hotels
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
          <Alert severity="info">No hotels found.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard; 