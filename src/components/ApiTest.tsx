// src/components/ApiTest.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, Paper, Divider, Link } from '@mui/material';
import axios from 'axios';
import api from '../services/api';

// Direct API URLs for testing different approaches
const DIRECT_API_URL = 'http://localhost:10888/api/v1';
const RELATIVE_API_URL = '/api/v1';

// Add routing test URLs
const HOTEL_LIST_URL = '/api/v1/hotel';
const DIRECT_HOTEL_LIST_URL = `${DIRECT_API_URL}/hotel`;

const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directStatus, setDirectStatus] = useState<any>(null);
  const [directError, setDirectError] = useState<string | null>(null);
  const [relativeStatus, setRelativeStatus] = useState<any>(null);
  const [relativeError, setRelativeError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [hotelsError, setHotelsError] = useState<string | null>(null);

  // Test using the API service
  const checkApiService = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Checking API service with baseURL:', api.defaults.baseURL);
      const response = await api.get('/status');
      setStatus(response.data);
      console.log('API service response:', response.data);
    } catch (err: any) {
      console.error('API service error details:', err);
      let errorMessage = err.message || 'Failed to connect to the API';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += ` (Status: ${err.response.status})`;
        console.error('Error response data:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage += ' (No response received)';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Test using direct API URL
  const checkDirectApi = async () => {
    try {
      console.log('Checking direct API at:', `${DIRECT_API_URL}/status`);
      const response = await axios.get(`${DIRECT_API_URL}/status`);
      setDirectStatus(response.data);
      console.log('Direct API response:', response.data);
    } catch (err: any) {
      console.error('Direct API error details:', err);
      let errorMessage = err.message || 'Failed to connect directly to API';
      
      if (err.response) {
        errorMessage += ` (Status: ${err.response.status})`;
      } else if (err.request) {
        errorMessage += ' (No response received)';
      }
      
      setDirectError(errorMessage);
    }
  };

  // Test using relative URL with Vite proxy
  const checkRelativeApi = async () => {
    try {
      console.log('Checking relative API at:', RELATIVE_API_URL + '/status');
      const response = await axios.get(RELATIVE_API_URL + '/status');
      setRelativeStatus(response.data);
      console.log('Relative API response:', response.data);
    } catch (err: any) {
      console.error('Relative API error details:', err);
      let errorMessage = err.message || 'Failed to connect via proxy';
      
      if (err.response) {
        errorMessage += ` (Status: ${err.response.status})`;
      } else if (err.request) {
        errorMessage += ' (No response received)';
      }
      
      setRelativeError(errorMessage);
    }
  };

  // Test getting hotel list
  const getHotels = async () => {
    try {
      console.log('Fetching hotels from:', DIRECT_HOTEL_LIST_URL);
      const response = await axios.get(DIRECT_HOTEL_LIST_URL);
      setHotels(response.data);
      console.log('Hotels response:', response.data);
      setHotelsError(null);
    } catch (err: any) {
      console.error('Hotel fetch error details:', err);
      let errorMessage = err.message || 'Failed to fetch hotels';
      
      if (err.response) {
        errorMessage += ` (Status: ${err.response.status})`;
      } else if (err.request) {
        errorMessage += ' (No response received)';
      }
      
      setHotelsError(errorMessage);
    }
  };

  useEffect(() => {
    // Run all tests on load
    checkApiService();
    checkDirectApi();
    checkRelativeApi();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        API Connectivity Tests
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Environment Information
        </Typography>
        <Typography variant="body2">API URL from API service: {api.defaults.baseURL}</Typography>
        <Typography variant="body2">Direct API URL: {DIRECT_API_URL}</Typography>
        <Typography variant="body2">Relative API URL: {RELATIVE_API_URL} (uses Vite proxy)</Typography>
        <Typography variant="body2" mt={1}>
          Try direct API access: <Link href={DIRECT_API_URL + '/status'} target="_blank">Open status endpoint</Link>
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test 1: Using API Service
        </Typography>
        {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {status && (
          <Box mt={1}>
            <Typography variant="body2">Status: {status.status}</Typography>
            <Typography variant="body2">Timestamp: {status.timestamp}</Typography>
            {status.message && (
              <Typography variant="body2">Message: {status.message}</Typography>
            )}
          </Box>
        )}
        
        <Button 
          variant="contained" 
          onClick={checkApiService} 
          disabled={loading}
          size="small"
          sx={{ mt: 2 }}
        >
          Test API Service
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test 2: Direct API Call
        </Typography>
        
        {directError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {directError}
          </Alert>
        )}
        
        {directStatus && (
          <Box mt={1}>
            <Typography variant="body2">Status: {directStatus.status}</Typography>
            <Typography variant="body2">Timestamp: {directStatus.timestamp}</Typography>
            {directStatus.message && (
              <Typography variant="body2">Message: {directStatus.message}</Typography>
            )}
          </Box>
        )}
        
        <Button 
          variant="contained" 
          onClick={checkDirectApi}
          size="small" 
          sx={{ mt: 2 }}
        >
          Test Direct API
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test 3: Relative API Call (Vite Proxy)
        </Typography>
        
        {relativeError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {relativeError}
          </Alert>
        )}
        
        {relativeStatus && (
          <Box mt={1}>
            <Typography variant="body2">Status: {relativeStatus.status}</Typography>
            <Typography variant="body2">Timestamp: {relativeStatus.timestamp}</Typography>
            {relativeStatus.message && (
              <Typography variant="body2">Message: {relativeStatus.message}</Typography>
            )}
          </Box>
        )}
        
        <Button 
          variant="contained" 
          onClick={checkRelativeApi}
          size="small" 
          sx={{ mt: 2 }}
        >
          Test Vite Proxy
        </Button>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test 4: Get Hotels (Main Application Data)
        </Typography>
        
        {hotelsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {hotelsError}
          </Alert>
        )}
        
        {hotels.length > 0 && (
          <Box mt={1}>
            <Typography variant="body2">Found {hotels.length} hotels:</Typography>
            {hotels.slice(0, 3).map((hotel, index) => (
              <Box key={index} mt={1} p={1} sx={{ bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">{hotel.name || 'Unnamed hotel'}</Typography>
              </Box>
            ))}
            {hotels.length > 3 && (
              <Typography variant="body2" mt={1}>
                ...and {hotels.length - 3} more
              </Typography>
            )}
          </Box>
        )}
        
        <Button 
          variant="contained" 
          onClick={getHotels}
          size="small" 
          sx={{ mt: 2 }}
        >
          Test Fetching Hotels
        </Button>
      </Paper>
    </Box>
  );
};

export default ApiTest; 