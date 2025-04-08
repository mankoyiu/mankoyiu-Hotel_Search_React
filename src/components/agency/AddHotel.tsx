import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar,
  Chip,
  Autocomplete,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { hotelService } from '../../services/hotel.service';
import { Hotel } from '../../types/hotel.types';
import { useAuth } from '../../contexts/AuthContext';

const amenities = [
  'WiFi',
  'Pool',
  'Spa',
  'Gym',
  'Restaurant',
  'Bar',
  'Room Service',
  'Parking',
  'Conference Room',
  'Business Center',
];

const roomTypes = [
  'Standard',
  'Deluxe',
  'Suite',
  'Executive',
  'Presidential',
  'Family',
  'Single',
  'Double',
  'Twin',
];

const accommodationTypes = [
  'Hotel',
  'Resort',
  'Motel',
  'Boutique Hotel',
  'Apartment Hotel',
  'Business Hotel',
  'Luxury Hotel',
];

export const AddHotel: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState<Partial<Hotel>>({
    name: '',
    description: '',
    location: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: [],
    policies: [],
    star: 3,
    priceRange: {
      min: 0,
      max: 0,
      currency: 'USD',
    },
    roomTypes: [],
    photos: [],
    status: 'active',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    accommodationType: 'Hotel',
    facilities: [],
    ranking: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 1) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
    const { name, value } = e.target;
    setHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHotel((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange!,
        [name]: Number(value),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user || user.role !== 1) {
        throw new Error('Only agency users can add hotels');
      }

      const hotelData = {
        ...hotel,
        agencyId: user.username
      };

      await hotelService.createHotel(hotelData as Hotel);
      setSuccess('Hotel added successfully!');
      setTimeout(() => {
        navigate('/agency/hotels');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add hotel');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user || user.role !== 1) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography>
            Only agency users can add hotels. Please log in with an agency account.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Hotel
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hotel Name"
                name="name"
                value={hotel.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={hotel.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={hotel.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={hotel.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={hotel.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={hotel.country}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={hotel.zipCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={hotel.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={hotel.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={hotel.website}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-in Time"
                name="checkInTime"
                type="time"
                value={hotel.checkInTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-out Time"
                name="checkOutTime"
                type="time"
                value={hotel.checkOutTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={hotel.amenities}
                  onChange={handleSelectChange}
                  name="amenities"
                  input={<OutlinedInput label="Amenities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {amenities.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      {amenity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Room Types</InputLabel>
                <Select
                  multiple
                  value={hotel.roomTypes}
                  onChange={handleSelectChange}
                  name="roomTypes"
                  input={<OutlinedInput label="Room Types" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minimum Price"
                name="min"
                type="number"
                value={hotel.priceRange?.min}
                onChange={handlePriceRangeChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Maximum Price"
                name="max"
                type="number"
                value={hotel.priceRange?.max}
                onChange={handlePriceRangeChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={hotel.priceRange?.currency}
                  onChange={(e) =>
                    setHotel((prev) => ({
                      ...prev,
                      priceRange: {
                        ...prev.priceRange!,
                        currency: e.target.value,
                      },
                    }))
                  }
                  label="Currency"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Accommodation Type</InputLabel>
                <Select
                  value={hotel.accommodationType}
                  onChange={(e) =>
                    setHotel((prev) => ({
                      ...prev,
                      accommodationType: e.target.value,
                    }))
                  }
                  label="Accommodation Type"
                >
                  {accommodationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Star Rating</InputLabel>
                <Select
                  value={hotel.star}
                  onChange={(e) =>
                    setHotel((prev) => ({
                      ...prev,
                      star: Number(e.target.value),
                    }))
                  }
                  label="Star Rating"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MenuItem key={star} value={star}>
                      {star} Star{star > 1 ? 's' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/agency/hotels')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Hotel'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={() => {
            setError(null);
            setSuccess(null);
          }}
        >
          <Alert
            onClose={() => {
              setError(null);
              setSuccess(null);
            }}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default AddHotel; 